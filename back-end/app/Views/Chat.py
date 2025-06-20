# type: ignore
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count, Max
from accounts.permissions import IsDoctor, IsPatient
from ..Models.chat import ChatRoom, ChatParticipant, ChatMessage, MessageReadStatus
from ..Serializers.chat import (
    ChatRoomListSerializer, ChatRoomDetailSerializer, ChatRoomCreateSerializer,
    ChatMessageSerializer, MessageCreateSerializer, AddParticipantSerializer,
    ChatParticipantSerializer, PatientListSerializer
)
from accounts.models import User


class ChatRoomListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get rooms where user is a participant
        rooms = ChatRoom.objects.filter(
            participants__user=user,
            participants__is_active=True,
            is_active=True
        ).distinct().annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time', '-updated_at')
        
        serializer = ChatRoomListSerializer(
            rooms, many=True, context={'request': request}
        )
        return Response(serializer.data)
    
    def post(self, request):
        if request.user.user_type != 'doctor':
            return Response(
                {"error": "Only doctors can create chat rooms"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ChatRoomCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Check for existing individual chat
            if serializer.validated_data.get('room_type') == 'individual':
                participant_ids = serializer.validated_data.get('participant_ids', [])
                if participant_ids:
                    # Check if individual chat already exists
                    existing_room = ChatRoom.objects.filter(
                        room_type='individual',
                        participants__user=request.user,
                        participants__user_id__in=participant_ids,
                        is_active=True
                    ).annotate(
                        participant_count=Count('participants', filter=Q(participants__is_active=True))
                    ).filter(participant_count=2).first()
                    
                    if existing_room:
                        serializer = ChatRoomDetailSerializer(
                            existing_room, context={'request': request}
                        )
                        return Response(serializer.data)
            
            # Create new room
            chat_room = serializer.save(created_by=request.user)
            response_serializer = ChatRoomDetailSerializer(
                chat_room, context={'request': request}
            )
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatRoomDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, room_id, user):
        """Get chat room if user is a participant"""
        return get_object_or_404(
            ChatRoom,
            id=room_id,
            participants__user=user,
            participants__is_active=True,
            is_active=True
        )
    
    def get(self, request, room_id):
        """Get chat room details"""
        room = self.get_object(room_id, request.user)
        
        # Update user's last read time
        participant = room.participants.filter(user=request.user).first()
        if participant:
            participant.last_read_at = timezone.now()
            participant.save()
        
        serializer = ChatRoomDetailSerializer(room, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, room_id):
        """Update chat room (only creator or doctors can update)"""
        room = self.get_object(room_id, request.user)
        
        # Check permissions
        if room.created_by != request.user and request.user.user_type != 'doctor':
            return Response(
                {"error": "Only the creator or doctors can update this room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Only allow updating name and description
        allowed_fields = ['name', 'description']
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        for field, value in update_data.items():
            setattr(room, field, value)
        
        room.save()
        
        serializer = ChatRoomDetailSerializer(room, context={'request': request})
        return Response(serializer.data)
    
    def delete(self, request, room_id):
        """Archive chat room (only creator can archive)"""
        room = self.get_object(room_id, request.user)
        
        if room.created_by != request.user:
            return Response(
                {"error": "Only the creator can archive this room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        room.is_archived = True
        room.save()
        
        return Response({"message": "Chat room archived successfully"})


class ChatMessageListCreateView(APIView):
    """
    List messages in a chat room or send a new message
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, room_id):
        """Get messages for a chat room"""
        # Verify user is participant
        room = get_object_or_404(
            ChatRoom,
            id=room_id,
            participants__user=request.user,
            participants__is_active=True,
            is_active=True
        )
        
        # Get pagination parameters
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        offset = (page - 1) * page_size
        
        # Get messages
        messages = room.messages.filter(
            is_deleted=False
        ).order_by('-created_at')[offset:offset + page_size]
        
        serializer = ChatMessageSerializer(
            messages, many=True, context={'request': request}
        )
        
        # Update user's last read time
        participant = room.participants.filter(user=request.user).first()
        if participant:
            participant.last_read_at = timezone.now()
            participant.save()
        
        return Response({
            'messages': serializer.data,
            'page': page,
            'page_size': page_size,
            'has_more': len(messages) == page_size
        })
    
    def post(self, request, room_id):
        """Send a message to a chat room"""
        # Verify user is participant
        room = get_object_or_404(
            ChatRoom,
            id=room_id,
            participants__user=request.user,
            participants__is_active=True,
            is_active=True
        )
        
        data = request.data.copy()
        data['room'] = room.id
        
        serializer = MessageCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            message = serializer.save(sender=request.user)
            
            # Update room's updated_at timestamp
            room.updated_at = timezone.now()
            room.save()
            
            response_serializer = ChatMessageSerializer(
                message, context={'request': request}
            )
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatParticipantManagementView(APIView):
    """
    Manage participants in a chat room (add/remove)
    """
    permission_classes = [IsAuthenticated, IsDoctor]
    
    def post(self, request, room_id):
        """Add participants to a chat room"""
        room = get_object_or_404(
            ChatRoom,
            id=room_id,
            created_by=request.user,
            is_active=True
        )
        
        if room.room_type == 'individual':
            return Response(
                {"error": "Cannot add participants to individual chat"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AddParticipantSerializer(data=request.data)
        if serializer.is_valid():
            user_ids = serializer.validated_data['user_ids']
            added_users = []
            
            with transaction.atomic():
                for user_id in user_ids:
                    user = User.objects.get(id=user_id)
                    participant, created = ChatParticipant.objects.get_or_create(
                        room=room,
                        user=user,
                        defaults={'is_active': True}
                    )
                    
                    if not created and not participant.is_active:
                        participant.rejoin_room()
                    
                    if created or not participant.is_active:
                        added_users.append(user.username)
                        
                        # Create system message
                        ChatMessage.objects.create(
                            room=room,
                            message_type='system',
                            content=f"{user.username} was added to the group"
                        )
            
            return Response({
                "message": f"Added users: {', '.join(added_users)}",
                "added_users": added_users
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, room_id):
        """Remove a participant from chat room"""
        room = get_object_or_404(
            ChatRoom,
            id=room_id,
            created_by=request.user,
            is_active=True
        )
        
        if room.room_type == 'individual':
            return Response(
                {"error": "Cannot remove participants from individual chat"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        participant = get_object_or_404(
            ChatParticipant,
            room=room,
            user_id=user_id,
            is_active=True
        )
        
        # Don't allow removing the creator
        if participant.user == room.created_by:
            return Response(
                {"error": "Cannot remove the room creator"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        participant.leave_room()
        
        # Create system message
        ChatMessage.objects.create(
            room=room,
            message_type='system',
            content=f"{participant.user.username} was removed from the group"
        )
        
        return Response({"message": "Participant removed successfully"})


class MarkMessagesReadView(APIView):
    """
    Mark messages as read
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, room_id):
        """Mark all messages in room as read"""
        room = get_object_or_404(
            ChatRoom,
            id=room_id,
            participants__user=request.user,
            participants__is_active=True,
            is_active=True
        )
        
        # Get unread messages
        participant = room.participants.filter(user=request.user).first()
        if participant:
            unread_messages = room.messages.filter(
                created_at__gt=participant.last_read_at,
                is_deleted=False
            ).exclude(sender=request.user)
            
            # Create read status for each unread message
            read_statuses = []
            for message in unread_messages:
                read_status, created = MessageReadStatus.objects.get_or_create(
                    message=message,
                    user=request.user
                )
                if created:
                    read_statuses.append(read_status)
            
            # Update participant's last read time
            participant.last_read_at = timezone.now()
            participant.save()
            
            return Response({
                "message": f"Marked {len(read_statuses)} messages as read"
            })
        
        return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)




#  Patient List
class PatientListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        patients = User.objects.filter(user_type='patient', is_active=True)
        serializer = PatientListSerializer(patients, many=True)
        return Response(serializer.data)
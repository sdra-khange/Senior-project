# type: ignore

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q

from ..Models.Chat import ChatRoom, ChatRoomMember, Message
from ..Serializers.Chat import ChatRoomSerializer, MessageSerializer, ChatRoomMemberSerializer

class ChatRoomListCreate(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all chat rooms where user is a member
        user_rooms = ChatRoom.objects.filter(
            Q(members__user=request.user) | Q(doctor=request.user),
            is_active=True
        ).distinct()
        
        serializer = ChatRoomSerializer(user_rooms, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        room_type = data.get('room_type')
        
        if room_type == 'ONE_TO_ONE':
            # Check if chat already exists between these users
            patient_id = data.get('patient_id')
            existing_chat = ChatRoom.objects.filter(
                room_type='ONE_TO_ONE',
                doctor=request.user,
                members__user_id=patient_id
            ).first()
            
            if existing_chat:
                serializer = ChatRoomSerializer(existing_chat)
                return Response(serializer.data)
        
        # Create new chat room
        data['doctor'] = request.user.id
        serializer = ChatRoomSerializer(data=data)
        if serializer.is_valid():
            chat_room = serializer.save()
            
            # Add members
            if room_type == 'ONE_TO_ONE':
                ChatRoomMember.objects.create(
                    chat_room=chat_room,
                    user_id=data['patient_id']
                )
            elif room_type == 'SUPPORT_GROUP':
                for patient_id in data.get('patient_ids', []):
                    ChatRoomMember.objects.create(
                        chat_room=chat_room,
                        user_id=patient_id
                    )
            
            return Response(ChatRoomSerializer(chat_room).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChatRoomDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, room_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        if not (chat_room.doctor == request.user or 
                ChatRoomMember.objects.filter(chat_room=chat_room, user=request.user).exists()):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = ChatRoomSerializer(chat_room)
        return Response(serializer.data)
    
    def delete(self, request, room_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        if chat_room.doctor != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        chat_room.is_active = False
        chat_room.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChatMessages(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, room_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        if not (chat_room.doctor == request.user or 
                ChatRoomMember.objects.filter(chat_room=chat_room, user=request.user).exists()):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        messages = Message.objects.filter(chat_room=chat_room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class ChatRoomMembers(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, room_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        if chat_room.doctor != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        if chat_room.room_type != 'SUPPORT_GROUP':
            return Response(
                {"error": "Cannot add members to one-to-one chat"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_member_id = request.data.get('user_id')
        if ChatRoomMember.objects.filter(chat_room=chat_room, user_id=new_member_id).exists():
            return Response(
                {"error": "User is already a member"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member = ChatRoomMember.objects.create(
            chat_room=chat_room,
            user_id=new_member_id
        )
        
        serializer = ChatRoomMemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, room_id, member_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        if chat_room.doctor != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        member = get_object_or_404(ChatRoomMember, id=member_id, chat_room=chat_room)
        member.is_active = False
        member.save()
        return Response(status=status.HTTP_204_NO_CONTENT) 
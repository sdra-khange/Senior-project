# type: ignore

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from ..Models.chat import ChatRoom, ChatParticipant, ChatMessage, MessageReadStatus

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'user_type', 'profile_photo']


class ChatParticipantSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ChatParticipant
        fields = [
            'id', 'user', 'user_id', 'joined_at', 'left_at', 
            'is_active', 'notifications_enabled', 'last_read_at'
        ]
        read_only_fields = ['id', 'joined_at', 'left_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    sender_id = serializers.IntegerField(write_only=True, required=False)
    is_read = serializers.SerializerMethodField()
    read_by_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'room', 'sender', 'sender_id', 'message_type', 'content',
            'created_at', 'updated_at', 'is_edited', 'is_deleted',
            'file_url', 'file_name', 'file_size', 'is_read', 'read_by_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'is_edited', 
            'is_deleted', 'is_read', 'read_by_count'
        ]
    
    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return MessageReadStatus.objects.filter(
                message=obj, user=request.user
            ).exists()
        return False
    
    def get_read_by_count(self, obj):
        return obj.read_statuses.count()


class ChatRoomListSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    participant_count = serializers.ReadOnlyField()
    last_message = ChatMessageSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()
    participants = ChatParticipantSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'room_type', 'description', 'created_by',
            'created_at', 'updated_at', 'is_active', 'is_archived',
            'participant_count', 'last_message', 'unread_count', 'participants'
        ]
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Get user's last read time for this room
            participant = obj.participants.filter(
                user=request.user, is_active=True
            ).first()
            
            if participant:
                return obj.messages.filter(
                    created_at__gt=participant.last_read_at,
                    is_deleted=False
                ).exclude(sender=request.user).count()
        return 0


class ChatRoomDetailSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    participants = ChatParticipantSerializer(many=True, read_only=True)
    messages = serializers.SerializerMethodField()
    participant_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'room_type', 'description', 'created_by',
            'created_at', 'updated_at', 'is_active', 'is_archived',
            'participants', 'messages', 'participant_count'
        ]
    
    def get_messages(self, obj):
        messages = obj.messages.filter(is_deleted=False).order_by('-created_at')[:50]
        return ChatMessageSerializer(
            messages, many=True, context=self.context
        ).data


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = ChatRoom
        fields = [
            'name', 'room_type', 'description', 'participant_ids'
        ]
    
    def validate(self, data):
        room_type = data.get('room_type', 'individual')
        participant_ids = data.get('participant_ids', [])
        
        if room_type == 'individual' and len(participant_ids) != 1:
            raise serializers.ValidationError(
                "Individual chat must have exactly 1 other participant"
            )
        
        if room_type == 'group' and len(participant_ids) < 1:
            raise serializers.ValidationError(
                "Group chat must have at least 1 participant"
            )
        
        # Validate that all participant IDs exist and are patients
        if participant_ids:
            users = User.objects.filter(id__in=participant_ids)
            if users.count() != len(participant_ids):
                raise serializers.ValidationError("Some participant IDs are invalid")
            
            # For now, allow both doctors and patients in groups
            # but individual chats should be doctor-patient only
            if room_type == 'individual':
                patient_users = users.filter(user_type='patient')
                if patient_users.count() != 1:
                    raise serializers.ValidationError(
                        "Individual chat must be with a patient"
                    )
        
        return data
    
    def create(self, validated_data):
        """Create chat room with participants"""
        participant_ids = validated_data.pop('participant_ids', [])
        
        with transaction.atomic():
            # Create the chat room
            chat_room = ChatRoom.objects.create(**validated_data)
            
            # Add creator as participant
            ChatParticipant.objects.create(
                room=chat_room,
                user=validated_data['created_by']
            )
            
            # Add other participants
            for user_id in participant_ids:
                user = User.objects.get(id=user_id)
                ChatParticipant.objects.create(
                    room=chat_room,
                    user=user
                )
            
            # For individual chats, auto-generate name
            if chat_room.room_type == 'individual' and participant_ids:
                other_user = User.objects.get(id=participant_ids[0])
                chat_room.name = f"Chat with {other_user.username}"
                chat_room.save()
        
        return chat_room


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['room', 'message_type', 'content', 'file_url', 'file_name', 'file_size']
    
    def validate_room(self, value):
        """Validate that user is a participant in the room"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if not value.participants.filter(
                user=request.user, is_active=True
            ).exists():
                raise serializers.ValidationError(
                    "You are not a participant in this chat room"
                )
        return value


class AddParticipantSerializer(serializers.Serializer):
    """Serializer for adding participants to a chat room"""
    user_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    
    def validate_user_ids(self, value):
        """Validate user IDs"""
        users = User.objects.filter(id__in=value)
        if users.count() != len(value):
            raise serializers.ValidationError("Some user IDs are invalid")
        return value



class PatientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
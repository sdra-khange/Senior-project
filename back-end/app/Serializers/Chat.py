# type: ignore

from rest_framework import serializers
from ..Models.Chat import ChatRoom, ChatRoomMember, Message
from accounts.serializers import AdminUserSerializer as UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_details = UserSerializer(source='sender', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'created_at', 'is_read', 'sender', 'sender_details']
        read_only_fields = ['sender']

class ChatRoomMemberSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = ChatRoomMember
        fields = ['id', 'user', 'user_details', 'joined_at', 'is_active']

class ChatRoomSerializer(serializers.ModelSerializer):
    members = ChatRoomMemberSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    doctor_details = UserSerializer(source='doctor', read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'room_type', 'name', 'created_at', 'updated_at', 
                 'doctor', 'doctor_details', 'members', 'last_message', 'is_active']
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None 
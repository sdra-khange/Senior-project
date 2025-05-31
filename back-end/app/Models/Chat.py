from django.db import models
from accounts.models import User
from django.utils import timezone

class ChatRoom(models.Model):
    ROOM_TYPES = (
        ('ONE_TO_ONE', 'One to One Chat'),
        ('SUPPORT_GROUP', 'Support Group Chat')
    )
    
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, null=True, blank=True)  # For support groups
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_chats')
    is_active = models.BooleanField(default=True)

class ChatRoomMember(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['chat_room', 'user']

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at'] 

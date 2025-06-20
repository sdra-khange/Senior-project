from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.exceptions import ValidationError

User = get_user_model()


class ChatRoom(models.Model):
    ROOM_TYPE_CHOICES = [
        ('individual', 'Individual Chat'),
        ('group', 'Group Chat'),
    ]
    
    name = models.CharField(
        max_length=255,
        help_text="Room name (for groups) or auto-generated for individual chats"
    )
    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
        default='individual'
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Room description (optional)"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_chat_rooms',
        help_text="User who created the room (usually a doctor for groups)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Chat Room"
        verbose_name_plural = "Chat Rooms"
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['created_by', 'room_type']),
            models.Index(fields=['is_active', 'is_archived']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_room_type_display()})"
    
    def clean(self):
        """Validate chat room data"""
        if self.room_type == 'individual' and self.pk:
            participant_count = self.participants.filter(is_active=True).count()
            if participant_count > 2:
                raise ValidationError("Individual chat can only have 2 participants")
        
        # Ensure created_by is a doctor for group chats
        if self.room_type == 'group' and self.created_by.user_type != 'doctor':
            raise ValidationError("Only doctors can create group chats")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def participant_count(self):
        return self.participants.filter(is_active=True).count()
    
    @property
    def last_message(self):
        return self.messages.filter(is_deleted=False).order_by('-created_at').first()


class ChatParticipant(models.Model):
    """
    Model for chat room participants
    """
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_participants'
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    notifications_enabled = models.BooleanField(default=True)
    last_read_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name = "Chat Participant"
        verbose_name_plural = "Chat Participants"
        ordering = ['joined_at']
        unique_together = ['room', 'user']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['room', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.username} in {self.room.name}"
    
    def leave_room(self):
        self.is_active = False
        self.left_at = timezone.now()
        self.save()
    
    def rejoin_room(self):
        self.is_active = True
        self.left_at = None
        self.save()


class ChatMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text Message'),
        ('system', 'System Message'),
        ('file', 'File Message'),
    ]
    
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        null=True,
        blank=True  # For system messages
    )
    message_type = models.CharField(
        max_length=20,
        choices=MESSAGE_TYPE_CHOICES,
        default='text'
    )
    content = models.TextField(help_text="Message content")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    
    # File-related fields
    file_url = models.URLField(blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_size = models.PositiveIntegerField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['room', 'created_at']),
            models.Index(fields=['sender', 'created_at']),
            models.Index(fields=['room', 'is_deleted']),
        ]
    
    def __str__(self):
        sender_name = self.sender.username if self.sender else "System"
        return f"{sender_name}: {self.content[:50]}..."
    
    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def mark_as_edited(self):
        self.is_edited = True
        self.save()


class MessageReadStatus(models.Model):
    message = models.ForeignKey(
        ChatMessage,
        on_delete=models.CASCADE,
        related_name='read_statuses'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='message_read_statuses'
    )
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Message Read Status"
        verbose_name_plural = "Message Read Statuses"
        unique_together = ['message', 'user']
        indexes = [
            models.Index(fields=['user', 'read_at']),
            models.Index(fields=['message', 'user']),
        ]
    
    def __str__(self):
        return f"{self.user.username} read message {self.message.id}"

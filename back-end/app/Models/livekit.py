from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class LiveKitRoom(models.Model):
    room_name = models.CharField(max_length=255, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.room_name} (Created by: {self.created_by.username})"
    
    class Meta:
        verbose_name = "LiveKit Room"
        verbose_name_plural = "LiveKit Rooms"


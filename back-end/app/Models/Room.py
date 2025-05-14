from django.db import models
from accounts.models import User
from django.core.exceptions import ValidationError
import uuid

class Room(models.Model):
    id = models.AutoField(primary_key=True)
    # Make room_id a CharField storing UUID string
    room_id = models.CharField(
        max_length=36,  # UUID string length
        unique=True,
        default=str(uuid.uuid4),
        editable=False
    )
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_chat_rooms',
        limit_choices_to={'user_type': 'doctor'}
    )
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='patient_chat_rooms',
        limit_choices_to={'user_type': 'patient'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('waiting', 'Waiting'),
            ('active', 'Active'),
            ('ended', 'Ended')
        ],
        default='waiting'
    )
    
    class Meta:
        db_table = 'chat_rooms'
        app_label = 'app'

    def save(self, *args, **kwargs):
        if not self.room_id:
            self.room_id = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Chat Room {self.room_id}"

    def clean(self):
        if self.doctor.user_type != 'doctor':
            raise ValidationError('Selected user must be a doctor')
        if self.patient.user_type != 'patient':
            raise ValidationError('Selected user must be a patient')
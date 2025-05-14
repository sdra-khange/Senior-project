from django.db import models
import uuid
from accounts.models import User
from django.core.exceptions import ValidationError

class VideoRoom(models.Model):
    room_id = models.UUIDField(default=uuid.uuid4, unique=True)
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_video_rooms',
        limit_choices_to={'user_type': 'doctor'}
    )
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='patient_video_rooms',
        limit_choices_to={'user_type': 'patient'}
    )
    session = models.ForeignKey('Session', on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[
            ('waiting', 'Waiting'),
            ('active', 'Active'),
            ('ended', 'Ended')
        ],
        default='waiting'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'video_rooms'

    def clean(self):
        if self.doctor.user_type != 'doctor':
            raise ValidationError('Selected user must be a doctor')
        if self.patient.user_type != 'patient':
            raise ValidationError('Selected user must be a patient')
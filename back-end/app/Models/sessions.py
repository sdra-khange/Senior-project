from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from accounts.models import User


class Session(models.Model):
    STATUS_CHOICES = (
        ('FREE', 'Free'),
        ('BOOKED', 'Booked'),
    )
    
    REAL_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    
    SESSION_TYPE_CHOICES = (
        ('VIDEO', 'Video Call'),
        ('VOICE', 'Voice Call'),
        ('MESSAGE', 'Messages'),
    )

    doctor = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='doctor_sessions'
    )
    patient = models.ForeignKey(
        User,  
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patient_sessions'
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='FREE'
    )
    real_status = models.CharField(
        max_length=10, 
        choices=REAL_STATUS_CHOICES, 
        default='PENDING'
    )
    booked_at = models.DateTimeField(auto_now_add=True, null=True)  
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    session_type = models.CharField(
        max_length=10,
        choices=SESSION_TYPE_CHOICES
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'date', 'start_time'],
                name='unique_doctor_session'
            )
        ]

    def clean(self):
        # First validate that doctor exists
        if not hasattr(self, 'doctor') or not self.doctor:
            raise ValidationError("Doctor is required for session")

        if not self.end_time:
            # Calculate end_time based on doctor's session duration
            start_datetime = datetime.combine(
                datetime.min, 
                self.start_time
            )
            end_datetime = start_datetime + timedelta(
                minutes=self.doctor.doctor_profile.session_duration
            )
            self.end_time = end_datetime.time()

        # Validate time slot
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")
        
        # Check for overlapping sessions
        overlapping = Session.objects.filter(
            doctor=self.doctor,
            date=self.date,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(id=self.id)
        
        if overlapping.exists():
            raise ValidationError("This session overlaps with another session")

        # Validate patient and status consistency
        if self.patient and self.status == 'FREE':
            raise ValidationError("Session with patient must be BOOKED")
        if not self.patient and self.status == 'BOOKED':
            raise ValidationError("BOOKED session must have a patient")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.doctor} - {self.date} {self.start_time}"

    def book(self, patient):
        if self.status != 'FREE':
            raise ValidationError("This session is not available for booking")
        self.status = 'BOOKED'
        self.patient = patient
        self.save()
        return self
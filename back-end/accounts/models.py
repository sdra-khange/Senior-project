from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, **extra_fields)
    
    
class User(AbstractUser):
    # Type of users
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    email = models.EmailField(max_length=60, unique=True)
    username = models.CharField(max_length=45)
    date_of_birth = models.DateField(null=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile_photo = models.ImageField(upload_to='photos/%y/%m/%d', default='../photos/user_default_photo.jpg')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    

    
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']
    
    def __str__(self):
        return self.username


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    
    specialization = models.CharField(max_length=255)
    experience_years = models.PositiveIntegerField()
    age = models.PositiveIntegerField()
    session_duration = models.PositiveIntegerField(choices=[(30, "30 minutes"), (60, "1 hour")])
    profile_picture = models.ImageField(upload_to='doctors/', null=True, blank=True)
    session_price = models.DecimalField(max_digits=10, decimal_places=2)  
    def str(self):
        return f"Dr. {self.user.username} - {self.specialization}"
    




class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    age = models.PositiveIntegerField()
    medical_record = models.FileField(upload_to='medical_record/', null=True, blank=True)
    def str(self):
        return f"Patient: {self.user.username}"
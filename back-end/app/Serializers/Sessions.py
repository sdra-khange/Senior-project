# # type: ignore

# from rest_framework import serializers
# from ..Models.sessions import Session
# from accounts.models import User, DoctorProfile, PatientProfile
# from rest_framework.exceptions import ValidationError
# from django.contrib.auth import authenticate

# class SessionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Session
#         fields = '__all__'




# class DoctorListSerializer(serializers.ModelSerializer):
#     specialization = serializers.CharField(source='doctor_profile.specialization')
#     experience_years = serializers.IntegerField(source='doctor_profile.experience_years')
#     profile_picture = serializers.ImageField(source='doctor_profile.profile_picture')
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'profile_photo', 'specialization', 'experience_years', 'profile_picture']

# class DoctorDetailSerializer(DoctorListSerializer):
#     age = serializers.IntegerField(source='doctor_profile.age')
#     session_duration = serializers.IntegerField(source='doctor_profile.session_duration')
#     session_price = serializers.DecimalField(source='doctor_profile.session_price', max_digits=10, decimal_places=2)
    
#     class Meta(DoctorListSerializer.Meta):
#         fields = DoctorListSerializer.Meta.fields + ['email', 'age', 'session_duration', 'session_price']

# class SessionSerializer(serializers.ModelSerializer):
#     doctor = DoctorListSerializer(read_only=True)
#     session_type_display = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Session
#         fields = '__all__'
    
#     def get_session_type_display(self, obj):
#         return obj.get_session_type_display()

# class BookingSerializer(serializers.Serializer):
#     session_id = serializers.IntegerField()
    
#     def validate_session_id(self, value):
#         try:
#             session = Session.objects.get(id=value)
#             if session.status != 'FREE':
#                 raise ValidationError("The session is not available for booked.")
#             return value
#         except Session.DoesNotExist:
#             raise ValidationError("The session does not exist ")

# class BookingConfirmationSerializer(serializers.ModelSerializer):
#     doctor = DoctorDetailSerializer()
#     session_type_display = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Session
#         fields = ['id', 'date', 'start_time', 'end_time', 'session_type', 'session_type_display', 'doctor']
    
#     def get_session_type_display(self, obj):
#         return obj.get_session_type_display()


# type: ignore

from rest_framework import serializers
from ..Models.sessions import Session
from accounts.models import User, DoctorProfile, PatientProfile
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate

class DoctorListSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(source='doctor_profile.specialization')
    experience_years = serializers.IntegerField(source='doctor_profile.experience_years')
    profile_picture = serializers.ImageField(source='doctor_profile.profile_picture')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_photo', 'specialization', 'experience_years', 'profile_picture']

class DoctorDetailSerializer(DoctorListSerializer):
    age = serializers.IntegerField(source='doctor_profile.age')
    session_duration = serializers.IntegerField(source='doctor_profile.session_duration')
    session_price = serializers.DecimalField(source='doctor_profile.session_price', max_digits=10, decimal_places=2)
    
    class Meta(DoctorListSerializer.Meta):
        fields = DoctorListSerializer.Meta.fields + ['email', 'age', 'session_duration', 'session_price']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class SessionSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_type='doctor'),
        write_only=True
    )
    doctor_details = DoctorListSerializer(source='doctor', read_only=True)
    patient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_type='patient'),
        required=False,
        allow_null=True
    )
    patient_details = PatientSerializer(source='patient', read_only=True)
    session_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'doctor', 'doctor_details', 'patient', 'patient_details',
            'status', 'real_status', 'date', 'start_time', 'end_time',
            'session_type', 'session_type_display', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'status': {'read_only': True},
            'real_status': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }
    
    def get_session_type_display(self, obj):
        return obj.get_session_type_display()
    
    def validate_doctor(self, value):
        if not hasattr(value, 'doctor_profile'):
            raise ValidationError("The specified user is not a doctor")
        return value
    
    def validate(self, data):
        if data.get('patient') and data.get('status', 'FREE') == 'FREE':
            raise ValidationError("Session with patient must be BOOKED")
        if not data.get('patient') and data.get('status') == 'BOOKED':
            raise ValidationError("BOOKED session must have a patient")
        return data

class BookingSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    
    def validate_session_id(self, value):
        try:
            session = Session.objects.get(id=value)
            if session.status != 'FREE':
                raise ValidationError("The session is not available for booking")
            return value
        except Session.DoesNotExist:
            raise ValidationError("The session does not exist")

class BookingConfirmationSerializer(serializers.ModelSerializer):
    doctor = DoctorDetailSerializer()
    patient = PatientSerializer()
    session_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'date', 'start_time', 'end_time', 
            'session_type', 'session_type_display',
            'doctor', 'patient'
        ]
    
    def get_session_type_display(self, obj):
        return obj.get_session_type_display()
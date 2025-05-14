# type: ignore
from rest_framework import serializers
from .models import User,DoctorProfile
from rest_framework.validators import ValidationError
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate 
from django.contrib.auth.hashers import check_password
from .models import PatientProfile


# SignUp Serializer
class SignUpSerializer(serializers.ModelSerializer):
    email=serializers.CharField(max_length=60)
    username=serializers.CharField(max_length=45)
    password=serializers.CharField(min_length=8, write_only=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)

    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'user_type']
        
    # Validate email
    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': ('Email has already been used')})
        return super().validate(attrs)
        
    # Create user and set password 
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        Token.objects.create(user=user)
        return user
    
        

class LoginSerializer(serializers.Serializer):
    # Login Serializer
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)

    # Validate email and password
    def validate(self, attrs):
        # extract email, password and user type from attrs
        email = attrs.get('email')
        password = attrs.get('password')
        user_type = attrs.get('user_type')
        
        user = authenticate(email=email, password=password)
        # Check if user is authenticated
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        # Check if user type is correct
        if user.user_type != user_type:
            raise serializers.ValidationError(f'This account is not a {user_type} account')
        # add user to attrs
        attrs['user'] = user
        return attrs
    

# Reset Password
class AdminUserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False)
    account_status = serializers.BooleanField(source='is_active', required=False)

    class Meta:
        model = User
        fields = ['account_status', 'new_password']
        extra_kwargs = {'new_password': {'write_only': True}}

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get('is_active', instance.is_active)
        #change the password
        new_password = validated_data.get('new_password')
        if new_password:
            instance.set_password(new_password)
            instance.save()
        return instance




class UpdateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username' , 'profile_photo']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['id', 'specialization', 'experience_years', 'age', 'session_duration', 'profile_picture', 'session_price']



class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['user', 'age', 'medical_record', 'profile_picture']
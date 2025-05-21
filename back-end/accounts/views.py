# type: ignore

from django.shortcuts import render
from .serializers import SignUpSerializer, LoginSerializer,UpdateUserSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny ,IsAuthenticated
from django.contrib.auth.hashers import check_password
from .tokens import create_jwt_pair_for_user
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import DoctorProfile, User ,PatientProfile
from .serializers import DoctorProfileSerializer,PatientProfileSerializer
from rest_framework import generics, permissions


# Create your views here.

class SignUpView(generics.GenericAPIView):
    permission_classes = [AllowAny] 
    serializer_class = SignUpSerializer
    

    def post(self, request: Request):
        data = request.data        
        serializer = self.serializer_class(data=data)
        
        if serializer.is_valid():
            user = serializer.save()
            tokens = create_jwt_pair_for_user(user)
            response = {
                "message": "User created successfully",
                "user": serializer.data, # user data
                "tokens": tokens # access & refresh tokens
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            # Get the authenticated user from the serializer
            user = serializer.validated_data['user']
            # Create tokens for the user
            tokens = create_jwt_pair_for_user(user)
            
            return Response({
                "message": "Login successful",
                "tokens": tokens,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "user_type": user.user_type
                }
            })
            
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# Doctor Login View
class DoctorLoginView(LoginView):
    def post(self, request):
        request.data['user_type'] = 'doctor'
        return super().post(request)

# Admin Login View
class AdminLoginView(LoginView):
    def post(self, request):
        request.data['user_type'] = 'admin'
        return super().post(request)

# Patient Login View
class PatientLoginView(LoginView):
    def post(self, request):
        request.data['user_type'] = 'patient'
        return super().post(request)




# Change Password 
class ChangePasswordView(APIView):
    permission_classes=[IsAuthenticated]
    def put(self, request:Request):
            user = request.user
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            
            if check_password(old_password, user.password):
                if len(new_password)>=8:
                    user.set_password(new_password)
                    user.save()
                    return Response(data={'message': 'Password changed successfully'},status=status.HTTP_200_OK)
                return Response(data={'message':'the new password need to be more than 8 characters'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)





# Change his account
class updateUserInfo(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self, request:Request):
        user=request.user
        new_data=request.data
        serializer=UpdateUserSerializer(instance=user, data=new_data)
        if serializer.is_valid():
            serializer.save()
            response={'message':'the profile data has been updated successfully', 'data':serializer.data}
            return Response(data=response, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# View his account 
class userInfoView(APIView):
# here the user can see info of his own account 
    permission_classes=[IsAuthenticated]
    serializer_class=SignUpSerializer
    def get(self,request:Request, pk:int):
        user=get_object_or_404(User, pk=pk)
        serializer=self.serializer_class(instance=user)
        response={"message":"the user of this id","data":serializer.data}
        return Response(data=response, status=status.HTTP_200_OK)
    

# add profile info to the doctor 
class DoctorProfileCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = DoctorProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# display and update specific profile doctor 
class DoctorProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            doctor_profile = DoctorProfile.objects.get(user=user)
            serializer = DoctorProfileSerializer(doctor_profile)
            return Response(serializer.data)
        except DoctorProfile.DoesNotExist:
            # إذا لم يكن الملف الشخصي موجوداً، قم بإنشائه
            serializer = DoctorProfileSerializer(data={})
            if serializer.is_valid():
                doctor_profile = serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            user = request.user
            doctor_profile = DoctorProfile.objects.get(user=user)
            serializer = DoctorProfileSerializer(doctor_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DoctorProfile.DoesNotExist:
            # إذا لم يكن الملف الشخصي موجوداً، قم بإنشائه
            serializer = DoctorProfileSerializer(data=request.data)
            if serializer.is_valid():
                doctor_profile = serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient_profile = request.user.patient_profile
            serializer = PatientProfileSerializer(patient_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PatientProfile.DoesNotExist:
            return Response({"error": "Patient profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            patient_profile = request.user.patient_profile
            serializer = PatientProfileSerializer(patient_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PatientProfile.DoesNotExist:
            return Response({"error": "Patient profile not found."}, status=status.HTTP_404_NOT_FOUND)
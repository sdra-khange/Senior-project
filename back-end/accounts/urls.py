# type: ignore

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    SignUpView, LoginView, 
    DoctorLoginView, AdminLoginView, PatientLoginView,ChangePasswordView,updateUserInfo,
    userInfoView,DoctorProfileView,DoctorProfileCreateView,PatientProfileView
)

urlpatterns = [
    # public
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    
    # LOGIN 
    path('login/doctor/', DoctorLoginView.as_view(), name='doctor_login'),
    path('login/admin/', AdminLoginView.as_view(), name='admin_login'),
    path('login/patient/', PatientLoginView.as_view(), name='patient_login'),
    
    # JWT
    path('jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('jwt/verify/', TokenVerifyView.as_view(), name='jwt_verify'),

    # password
    path('password',ChangePasswordView.as_view(),name='password'),
    # Change user info like a profile photo and username 
    path('account-info',updateUserInfo.as_view(),name='account_info'),
        # view user info 
    path('user/<int:pk>',userInfoView.as_view(),name='user'),
    # add info to profile
    path('profile/create/', DoctorProfileCreateView.as_view(), name='doctor-profile-create'),

    # view doctor profile
    path('profile/', DoctorProfileView.as_view(), name='doctor-profile'),
    
    #Patient 
    path('patient-profile/', PatientProfileView.as_view(), name='patient-profile'),

]
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
    userInfoView,DoctorProfileView,DoctorProfileCreateView,PatientProfileView,
    AdminStatsView, AdminUserListView, AdminDeactivateDoctorView,
    PatientProfileView,LogoutView,
    DoctorView, ChangeDoctorStatusView
)

urlpatterns = [
    # path('user/', userInfoView.as_view(), name='user-info'),

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
    
    # Patient profile endpoints
    path('patient/profile/', PatientProfileView.as_view(), name='patient-profile'),
    # path('patient/profile/update/', PatientProfileUpdateView.as_view(), name='patient-profile-update'),

    
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('admin/deactivate-doctor/<int:doctor_id>/', AdminDeactivateDoctorView.as_view(), name='deactivate-doctor'),
    
    # Logout 
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # manage Doctor profile endpoints
    path('doctor/profile/', DoctorView.as_view(), name='doctor-profile'),
    path('doctor/status/<int:doctor_id>/', ChangeDoctorStatusView.as_view(), name='change-doctor-status'),

]



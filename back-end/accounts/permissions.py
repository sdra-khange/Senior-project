# type: ignore
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.user_type == 'admin')

class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.user_type == 'doctor')

class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.user_type == 'patient')

class IsOwnerOrAdmin(permissions.BasePermission):
    # allow admin to edit anything
    def has_object_permission(self, request, view, obj):
        if request.user.user_type == 'admin':
            return True
        # allow user to edit his own data
        return obj.id == request.user.id 
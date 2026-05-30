# accounts/permissions.py
from rest_framework.permissions import BasePermission
from .models import User


class IsAdminOrModerator(BasePermission):
    """السماح فقط للـ admin و moderator"""
    message = "ليس لديك صلاحية للوصول لهذا المورد."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [User.Role.ADMIN, User.Role.MODERATOR]
            and request.user.status == User.Status.ACTIVE
        )


class IsAdmin(BasePermission):
    """السماح فقط للـ admin"""
    message = "هذا الإجراء للمديرين فقط."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ADMIN
            and request.user.status == User.Status.ACTIVE
        )


class IsOwnerOrAdmin(BasePermission):
    """السماح لصاحب الحساب أو المدير"""
    message = "لا يمكنك الوصول لبيانات مستخدم آخر."

    def has_object_permission(self, request, view, obj):
        return (
            request.user == obj
            or request.user.role == User.Role.ADMIN
        )
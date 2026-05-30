# accounts/views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserDetailSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
    UserListSerializer,
    AdminUpdateUserSerializer,
)
from .permissions import IsAdminOrModerator, IsOwnerOrAdmin


# ─────────────────────────────────────────
#  AUTH VIEWS
# ─────────────────────────────────────────

class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Body: { email, password }
    Returns: { access, refresh, user: {...} }
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Body: { email, username, person_name, last_name, phone, password, password_confirm }
    Returns: { user: {...}, access, refresh }
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # إنشاء tokens مباشرة بعد التسجيل
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # إضافة custom claims
        access['username'] = user.username
        access['email'] = user.email
        access['role'] = user.role
        access['status'] = user.status

        return Response(
            {
                'user': UserDetailSerializer(user).data,
                'access': str(access),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Body: { refresh }
    Blacklists the refresh token (requires BLACKLIST in INSTALLED_APPS)
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'الـ refresh token مطلوب.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {'detail': 'تم تسجيل الخروج بنجاح.'},
                status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/token/refresh/
    Body: { refresh }
    Returns: { access }
    — مباشرة من simplejwt مع إمكانية تخصيصها لاحقاً
    """
    pass


# ─────────────────────────────────────────
#  PROFILE VIEWS
# ─────────────────────────────────────────

class MeView(generics.RetrieveAPIView):
    """
    GET /api/auth/me/
    يعيد بيانات المستخدم الحالي
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UpdateProfileView(generics.UpdateAPIView):
    """
    PUT/PATCH /api/auth/me/update/
    """
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # PATCH بشكل افتراضي
        return super().update(request, *args, **kwargs)


class ChangePasswordView(APIView):
    """
    POST /api/auth/me/change-password/
    Body: { old_password, new_password, new_password_confirm }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': 'تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول من جديد.'},
            status=status.HTTP_200_OK
        )


class SoftDeleteAccountView(APIView):
    """
    DELETE /api/auth/me/delete/
    حذف ناعم للحساب
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.deleted_at = timezone.now()
        user.is_active = False
        user.status = User.Status.INACTIVE
        user.save(update_fields=['deleted_at', 'is_active', 'status'])
        return Response(
            {'detail': 'تم حذف الحساب.'},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────
#  ADMIN VIEWS
# ─────────────────────────────────────────

class UserListView(generics.ListAPIView):
    """
    GET /api/admin/users/
    فلترة: ?role=admin&status=active&search=username
    """
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrModerator]

    def get_queryset(self):
        qs = User.objects.all().order_by('-created_at')

        role = self.request.query_params.get('role')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if role:
            qs = qs.filter(role=role)
        if status_param:
            qs = qs.filter(status=status_param)
        if search:
            qs = qs.filter(
                username__icontains=search
            ) | qs.filter(
                email__icontains=search
            ) | qs.filter(
                person_name__icontains=search
            )
        return qs


class UserDetailAdminView(generics.RetrieveAPIView):
    """
    GET /api/admin/users/<uuid>/
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrModerator]
    queryset = User.objects.all()
    lookup_field = 'pk'


class AdminUpdateUserView(generics.UpdateAPIView):
    """
    PATCH /api/admin/users/<uuid>/update/
    Body: { role?, status?, is_active? }
    """
    serializer_class = AdminUpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrModerator]
    queryset = User.objects.all()
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class AdminSoftDeleteUserView(APIView):
    """
    DELETE /api/admin/users/<uuid>/delete/
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrModerator]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {'detail': 'المستخدم غير موجود.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if user == request.user:
            return Response(
                {'detail': 'لا يمكنك حذف حسابك الخاص من هنا.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.deleted_at = timezone.now()
        user.is_active = False
        user.status = User.Status.INACTIVE
        user.updated_by = request.user
        user.save(update_fields=['deleted_at', 'is_active', 'status', 'updated_by', 'updated_at'])

        return Response(
            {'detail': 'تم حذف المستخدم بنجاح.'},
            status=status.HTTP_204_NO_CONTENT
        )
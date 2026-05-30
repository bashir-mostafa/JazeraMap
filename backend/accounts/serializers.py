# accounts/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


# ─────────────────────────────────────────
#  Custom JWT payload
# ─────────────────────────────────────────
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """إضافة بيانات إضافية داخل الـ JWT token"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # حقول مخصصة داخل الـ payload
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['status'] = user.status
        token['full_name'] = user.get_full_name()
        return token

    def validate(self, attrs):
        # نستخدم email كـ username field
        data = super().validate(attrs)
        user = self.user

        if user.status == User.Status.BANNED:
            raise serializers.ValidationError(
                {'detail': 'هذا الحساب محظور. تواصل مع الدعم الفني.'}
            )
        if user.status == User.Status.SUSPENDED:
            raise serializers.ValidationError(
                {'detail': 'هذا الحساب معلق مؤقتاً.'}
            )
        if user.status == User.Status.INACTIVE or not user.is_active:
            raise serializers.ValidationError(
                {'detail': 'هذا الحساب غير نشط.'}
            )

        # إضافة بيانات المستخدم مع الـ tokens
        data['user'] = UserDetailSerializer(user).data
        return data


# ─────────────────────────────────────────
#  Register
# ─────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="كلمة المرور"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="تأكيد كلمة المرور"
    )

    class Meta:
        model = User
        fields = [
            'email', 'username', 'person_name', 'last_name',
            'phone', 'password', 'password_confirm',
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("البريد الإلكتروني مستخدم بالفعل.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("اسم المستخدم مستخدم بالفعل.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("رقم الهاتف مستخدم بالفعل.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'كلمتا المرور غير متطابقتين.'}
            )
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ─────────────────────────────────────────
#  User Detail (قراءة)
# ─────────────────────────────────────────
class UserDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'person_name', 'last_name',
            'full_name', 'phone', 'role', 'role_display',
            'status', 'status_display', 'is_active',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'created_at', 'updated_at']

    def get_full_name(self, obj):
        return obj.get_full_name()


# ─────────────────────────────────────────
#  Update Profile
# ─────────────────────────────────────────
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['person_name', 'last_name', 'phone', 'username']

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.filter(username__iexact=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("اسم المستخدم مستخدم بالفعل.")
        return value

    def validate_phone(self, value):
        user = self.context['request'].user
        if User.objects.filter(phone=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("رقم الهاتف مستخدم بالفعل.")
        return value

    def update(self, instance, validated_data):
        request_user = self.context['request'].user
        instance = super().update(instance, validated_data)
        instance.updated_by = request_user
        instance.save(update_fields=['updated_by', 'updated_at'])
        return instance


# ─────────────────────────────────────────
#  Change Password
# ─────────────────────────────────────────
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("كلمة المرور الحالية غير صحيحة.")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'كلمتا المرور الجديدتان غير متطابقتين.'}
            )
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


# ─────────────────────────────────────────
#  Admin: User List (مختصر)
# ─────────────────────────────────────────
class UserListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'full_name',
            'role', 'status', 'created_at',
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()


# ─────────────────────────────────────────
#  Admin: Update User Role/Status
# ─────────────────────────────────────────
class AdminUpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'status', 'is_active']

    def update(self, instance, validated_data):
        request_user = self.context['request'].user
        instance = super().update(instance, validated_data)
        instance.updated_by = request_user
        instance.save(update_fields=['updated_by', 'updated_at'])
        return instance
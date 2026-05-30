# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
import uuid


class UserManager(BaseUserManager):
    """مدير المستخدم المخصص"""
    
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('البريد الإلكتروني مطلوب')
        if not username:
            raise ValueError('اسم المستخدم مطلوب')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('status', 'active')
        
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """نموذج المستخدمين"""
    
    class Role(models.TextChoices):
        ADMIN = 'admin', 'مدير'
        USER = 'user', 'مستخدم'
        MODERATOR = 'moderator', 'مشرف'
        OWNER = 'owner', 'مالك'
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'نشط'
        INACTIVE = 'inactive', 'غير نشط'
        BANNED = 'banned', 'محظور'
        SUSPENDED = 'suspended', 'معلق'
    
    # المفتاح الأساسي (PK)
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="المعرف الفريد (UUID)"
    )
    
    # الحقول الأساسية
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="البريد الإلكتروني"
    )
    username = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
        help_text="اسم المستخدم"
    )
    password = models.CharField(
        max_length=128,
        help_text="كلمة المرور (مشفرة)"
    )
    
    # معلومات شخصية
    person_name = models.CharField(
        max_length=255,
        help_text="الاسم الشخصي"
    )
    last_name = models.CharField(
        max_length=255,
        help_text="اسم العائلة"
    )
    phone = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')],
        help_text="رقم الهاتف"
    )
    
    # الدور والصلاحيات
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
        db_index=True,
        help_text="نوع المستخدم (مدير، مستخدم، مشرف، مالك)"
    )
    
    # الحالة
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUSPENDED,
        db_index=True,
        help_text="حالة المستخدم (نشط، غير نشط، محظور، معلق)"
    )
    
    # حقول التدقيق (Audit Fields)
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="تاريخ الإنشاء"
    )
    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users_created',
        help_text="المستخدم الذي قام بإنشاء هذا الحساب"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="تاريخ آخر تحديث"
    )
    updated_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users_updated',
        help_text="آخر مستخدم قام بتعديل هذا الحساب"
    )
    
    # حقل إضافي للحذف الناعم (اختياري)
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="تاريخ الحذف"
    )
    
    # حقول Django المطلوبة
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'person_name', 'last_name', 'phone']
    
    objects = UserManager()
    
    class Meta:
        verbose_name = "مستخدم"
        verbose_name_plural = "المستخدمين"
        db_table = "users"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'status']),
            models.Index(fields=['username']),
            models.Index(fields=['role', 'status']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['phone']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.person_name} {self.last_name})"
    
    def get_full_name(self):
        """الحصول على الاسم الكامل"""
        return f"{self.person_name} {self.last_name}"
    
    def get_short_name(self):
        """الحصول على الاسم المختصر"""
        return self.person_name
    
    @property
    def is_admin(self):
        """هل المستخدم مدير؟"""
        return self.role == self.Role.ADMIN
    
    @property
    def is_moderator(self):
        """هل المستخدم مشرف؟"""
        return self.role == self.Role.MODERATOR
    
    @property
    def is_owner(self):
        """هل المستخدم مالك؟"""
        return self.role == self.Role.OWNER
    
    def soft_delete(self):
        """حذف ناعم"""
        self.deleted_at = models.DateTimeField(auto_now=True)
        self.is_active = False
        self.save()
    
    def restore(self):
        """استعادة حساب محذوف"""
        self.deleted_at = None
        self.is_active = True
        self.save()
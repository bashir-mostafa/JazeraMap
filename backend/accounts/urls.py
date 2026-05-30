# accounts/urls.py
from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    LogoutView,
    CustomTokenRefreshView,
    MeView,
    UpdateProfileView,
    ChangePasswordView,
    SoftDeleteAccountView,
    UserListView,
    UserDetailAdminView,
    AdminUpdateUserView,
    AdminSoftDeleteUserView,
)

# ─────────────────────────────────────────
#  AUTH
# ─────────────────────────────────────────
auth_urlpatterns = [
    path('login/',              LoginView.as_view(),              name='auth-login'),
    path('register/',           RegisterView.as_view(),            name='auth-register'),
    path('logout/',             LogoutView.as_view(),              name='auth-logout'),
    path('token/refresh/',      CustomTokenRefreshView.as_view(),  name='auth-token-refresh'),
]

# ─────────────────────────────────────────
#  ME (المستخدم الحالي)
# ─────────────────────────────────────────
me_urlpatterns = [
    path('me/',                 MeView.as_view(),                 name='me-detail'),
    path('me/update/',          UpdateProfileView.as_view(),       name='me-update'),
    path('me/change-password/', ChangePasswordView.as_view(),      name='me-change-password'),
    path('me/delete/',          SoftDeleteAccountView.as_view(),   name='me-delete'),
]

# ─────────────────────────────────────────
#  ADMIN
# ─────────────────────────────────────────
admin_urlpatterns = [
    path('admin/users/',                        UserListView.as_view(),          name='admin-user-list'),
    path('admin/users/<uuid:pk>/',              UserDetailAdminView.as_view(),   name='admin-user-detail'),
    path('admin/users/<uuid:pk>/update/',       AdminUpdateUserView.as_view(),   name='admin-user-update'),
    path('admin/users/<uuid:pk>/delete/',       AdminSoftDeleteUserView.as_view(), name='admin-user-delete'),
]

urlpatterns = auth_urlpatterns + me_urlpatterns + admin_urlpatterns
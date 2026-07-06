from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserViewSet, SalaryViewSet
from students.views import StudentViewSet
from groups.views import GroupViewSet
from attendance.views import AttendanceViewSet
from payments.views import PaymentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'salaries', SalaryViewSet, basename='salary')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Salary
from .serializers import UserSerializer, SalarySerializer

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(center=self.request.user.center)

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)

class SalaryViewSet(viewsets.ModelViewSet):
    serializer_class = SalarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.request.query_params.get('teacher')
        queryset = Salary.objects.filter(teacher__center=self.request.user.center)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        return queryset.order_by('-date')
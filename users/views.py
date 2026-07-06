from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import User, Salary
from .serializers import UserSerializer, SalarySerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(center=self.request.user.center)

    def get_object(self):
        obj = super().get_object()
        if obj.center != self.request.user.center:
            raise PermissionDenied("Шумо ба ин корбар дастрасӣ надоред!")
        return obj

    def perform_create(self, serializer):
        if serializer.validated_data.get('role') == 'owner':
            raise PermissionDenied("Owner созидан мумкин нест!")
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
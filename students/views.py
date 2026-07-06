from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Student.objects.filter(center=self.request.user.center)

    def get_object(self):
        obj = super().get_object()
        if obj.center != self.request.user.center:
            raise PermissionDenied("Шумо ба ин хонанда дастрасӣ надоред!")
        return obj

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Attendance.objects.filter(center=user.center)
        group_id = self.request.query_params.get('group')
        date = self.request.query_params.get('date')
        student_id = self.request.query_params.get('student')
        if group_id:
            queryset = queryset.filter(group_id=group_id)
        if date:
            queryset = queryset.filter(date=date)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset.order_by('-date')

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from users.permissions import IsOwnerOrAdmin
from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        queryset = Payment.objects.filter(center=self.request.user.center)
        student_id = self.request.query_params.get('student')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset

    def get_object(self):
        obj = super().get_object()
        if obj.center != self.request.user.center:
            raise PermissionDenied("Шумо ба ин пардохт дастрасӣ надоред!")
        return obj

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)
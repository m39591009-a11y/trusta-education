from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Group
from .serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(center=self.request.user.center)

    def get_object(self):
        obj = super().get_object()
        if obj.center != self.request.user.center:
            raise PermissionDenied("Шумо ба ин гурӯҳ дастрасӣ надоред!")
        return obj

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)
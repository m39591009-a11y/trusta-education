from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Group
from .serializers import GroupSerializer

class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(center=self.request.user.center)

    def perform_create(self, serializer):
        serializer.save(center=self.request.user.center)
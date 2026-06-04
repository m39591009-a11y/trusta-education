from rest_framework import serializers
from .models import Group
from users.serializers import UserSerializer

class GroupSerializer(serializers.ModelSerializer):
    teacher_detail = UserSerializer(source='teacher', read_only=True)
    
    class Meta:
        model = Group
        fields = '__all__'
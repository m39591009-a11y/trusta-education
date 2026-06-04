from rest_framework import serializers
from .models import User, Salary

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'role', 'phone', 'date_joined')

class SalarySerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.__str__', read_only=True)
    
    class Meta:
        model = Salary
        fields = '__all__'
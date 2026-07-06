from django.contrib.auth.models import AbstractUser
from django.db import models


class Center(models.Model):
    name = models.CharField(max_length=200, verbose_name='Номи марказ')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Марказ'
        verbose_name_plural = 'Марказҳо'

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='teacher')
    phone = models.CharField(max_length=20, blank=True)
    center = models.ForeignKey(Center, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Salary(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='salaries')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Маош'
        verbose_name_plural = 'Маошҳо'

    def __str__(self):
        return f"{self.teacher} - {self.amount} - {self.date}"
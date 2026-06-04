from django.db import models
from users.models import User

class Group(models.Model):
    name = models.CharField(max_length=100, verbose_name='Номи гурӯҳ')
    subject = models.CharField(max_length=100, verbose_name='Фан')
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='teaching_groups', verbose_name='Муаллим')
    schedule = models.CharField(max_length=200, verbose_name='Вақт')
    room = models.CharField(max_length=50, blank=True, verbose_name='Кабинет')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Нарх')
    is_active = models.BooleanField(default=True, verbose_name='Фаъол')

    class Meta:
        verbose_name = 'Гурӯҳ'
        verbose_name_plural = 'Гурӯҳҳо'

    def __str__(self):
        return self.name
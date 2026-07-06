from django.db import models


class Group(models.Model):
    center = models.ForeignKey('users.Center', on_delete=models.CASCADE, null=True, blank=True, related_name='groups')
    name = models.CharField(max_length=100, verbose_name='Номи гурӯҳ')
    subject = models.CharField(max_length=100, verbose_name='Фан')
    teacher = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='teaching_groups', verbose_name='Муаллим')
    schedule = models.CharField(max_length=200, blank=True, verbose_name='Вақт')
    room = models.CharField(max_length=50, blank=True, verbose_name='Кабинет')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Нарх')
    is_active = models.BooleanField(default=True, verbose_name='Фаъол')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Гурӯҳ'
        verbose_name_plural = 'Гурӯҳҳо'

    def __str__(self):
        return self.name
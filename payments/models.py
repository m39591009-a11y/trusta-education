from django.db import models


class Payment(models.Model):
    METHOD_CHOICES = (
        ('cash', 'Накд'),
        ('transfer', 'Перевод'),
    )
    center = models.ForeignKey('users.Center', on_delete=models.CASCADE, null=True, blank=True, related_name='payments')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='payments', verbose_name='Хонанда')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Маблағ')
    method = models.CharField(max_length=10, choices=METHOD_CHOICES, default='cash', verbose_name='Тарз')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Сана')
    note = models.TextField(blank=True, verbose_name='Шарҳ')

    class Meta:
        verbose_name = 'Пардохт'
        verbose_name_plural = 'Пардохтҳо'

    def __str__(self):
        return f"{self.student} - {self.amount} - {self.date}"
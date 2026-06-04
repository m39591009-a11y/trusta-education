from django.db import models

class Student(models.Model):
    STATUS_CHOICES = (
        ('active', 'Фаъол'),
        ('inactive', 'Ғайрифаъол'),
        ('frozen', 'Музд'),
    )
    first_name = models.CharField(max_length=100, verbose_name='Ном')
    last_name = models.CharField(max_length=100, verbose_name='Насаб')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    parent_phone = models.CharField(max_length=20, blank=True, verbose_name='Телефони волидон')
    group = models.ForeignKey('groups.Group', on_delete=models.SET_NULL, null=True, related_name='students', verbose_name='Гурӯҳ')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='Статус')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Баланс')
    start_date = models.DateField(auto_now_add=True, verbose_name='Таърихи оғоз')
    note = models.TextField(blank=True, verbose_name='Шарҳ')

    class Meta:
        verbose_name = 'Хонанда'
        verbose_name_plural = 'Хонандаҳо'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
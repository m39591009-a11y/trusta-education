from django.db import models


class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Омад'),
        ('absent', 'Наомад'),
        ('late', 'Дер кард'),
        ('excused', 'Сабаби эҳтиромнок'),
    )
    center = models.ForeignKey('users.Center', on_delete=models.CASCADE, null=True, blank=True, related_name='attendances')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='attendances', verbose_name='Хонанда')
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, related_name='attendances', verbose_name='Гурӯҳ')
    date = models.DateField(verbose_name='Сана')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present', verbose_name='Статус')
    late_minutes = models.IntegerField(default=0, verbose_name='Дақиқаи дер')
    note = models.TextField(blank=True, verbose_name='Шарҳ')

    class Meta:
        unique_together = ('student', 'date', 'group')
        verbose_name = 'Давомот'
        verbose_name_plural = 'Давомот'

    def __str__(self):
        return f"{self.student} - {self.date} - {self.status}"
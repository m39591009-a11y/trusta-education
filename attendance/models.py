from django.db import models
from students.models import Student
from groups.models import Group

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Омад'),
        ('absent', 'Наомад'),
        ('late', 'Дер кард'),
        ('excused', 'Сабаби эҳтиромнок'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances', verbose_name='Хонанда')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='attendances', verbose_name='Гурӯҳ')
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
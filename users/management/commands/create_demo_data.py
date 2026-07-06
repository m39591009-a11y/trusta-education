from django.core.management.base import BaseCommand
from users.models import User, Center
from students.models import Student
from groups.models import Group
from attendance.models import Attendance
from payments.models import Payment
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Create demo data'

    def handle(self, *args, **kwargs):
        # Center ёбем
        center = Center.objects.first()
        if not center:
            self.stdout.write('Center нест! Аввал create_initial_users иҷро кунед.')
            return

        teacher = User.objects.filter(role='teacher', center=center).first()

        # 3 Гурӯҳ созем
        groups_data = [
            {'name': 'English A1', 'subject': 'Англисӣ', 'schedule': 'Дш, Ср, Ҷм 09:00', 'price': 300},
            {'name': 'Math Pro', 'subject': 'Математика', 'schedule': 'Сш, Пш, Шн 14:00', 'price': 250},
            {'name': 'IT Basic', 'subject': 'Информатика', 'schedule': 'Дш, Ср 16:00', 'price': 350},
        ]

        groups = []
        for g in groups_data:
            group, created = Group.objects.get_or_create(
                name=g['name'],
                center=center,
                defaults={
                    'subject': g['subject'],
                    'schedule': g['schedule'],
                    'price': g['price'],
                    'teacher': teacher,
                    'is_active': True,
                }
            )
            groups.append(group)
            if created:
                self.stdout.write(f'Group {group.name} created!')

        # 20 Хонанда созем
        students_data = [
            ('Алӣ', 'Раҳимов'), ('Зарина', 'Назарова'), ('Баҳром', 'Юсупов'),
            ('Мадина', 'Каримова'), ('Рустам', 'Исмоилов'), ('Нилуфар', 'Ҳасанова'),
            ('Ҷамшед', 'Тошматов'), ('Гулнора', 'Раҷабова'), ('Шерзод', 'Мирзоев'),
            ('Феруза', 'Содиқова'), ('Умед', 'Бобоев'), ('Дилноза', 'Қосимова'),
            ('Санjar', 'Эргашев'), ('Мунира', 'Холиқова'), ('Бобур', 'Усмонов'),
            ('Озода', 'Турсунова'), ('Хуршед', 'Давлатов'), ('Лола', 'Маҳмудова'),
            ('Фирдавс', 'Ҳамидов'), ('Камола', 'Азимова'),
        ]

        students = []
        for i, (first, last) in enumerate(students_data):
            group = groups[i % 3]
            student, created = Student.objects.get_or_create(
                first_name=first,
                last_name=last,
                center=center,
                defaults={
                    'phone': f'+992 9{random.randint(0,9)} {random.randint(100,999)} {random.randint(1000,9999)}',
                    'group': group,
                    'balance': random.choice([0, 0, 0, -100, -200, 150]),
                }
            )
            students.append(student)
            if created:
                self.stdout.write(f'Student {first} {last} created!')

        # 5 Пардохт созем
        for i in range(5):
            student = random.choice(students)
            Payment.objects.create(
                student=student,
                amount=random.choice([200, 250, 300, 350]),
                method=random.choice(['cash', 'transfer']),
                center=center,
            )
        self.stdout.write('5 payments created!')

        # Давомоти 1 ҳафта созем
        today = date.today()
        for day_offset in range(7):
            day = today - timedelta(days=day_offset)
            for student in students[:10]:
                if not Attendance.objects.filter(student=student, date=day, group=student.group).exists():
                    Attendance.objects.create(
                        student=student,
                        group=student.group,
                        date=day,
                        status=random.choice(['present', 'present', 'present', 'absent', 'late']),
                        center=center,
                    )
        self.stdout.write('Attendance created!')

        self.stdout.write('Demo data tайёр! ✅')
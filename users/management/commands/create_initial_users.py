from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create initial users'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='owner').exists():
            User.objects.create_superuser(username='owner', password='Trusta2024', role='owner')
            self.stdout.write('Owner created!')
        if not User.objects.filter(username='admin1').exists():
            User.objects.create_user(username='admin1', password='Admin2024', role='admin')
            self.stdout.write('Admin created!')
        if not User.objects.filter(username='teacher1').exists():
            User.objects.create_user(username='teacher1', password='Teacher2024', role='teacher', first_name='Муаллим', last_name='Якум')
            self.stdout.write('Teacher created!')
        self.stdout.write('Done!')

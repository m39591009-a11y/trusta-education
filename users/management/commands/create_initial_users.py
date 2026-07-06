from django.core.management.base import BaseCommand
from users.models import User, Center

class Command(BaseCommand):
    help = 'Create initial users'

    def handle(self, *args, **kwargs):
        center, created = Center.objects.get_or_create(
            name='TRUSTA Demo Center',
            defaults={'phone': '+992 888 44 27 64', 'address': 'Душанбе'}
        )
        if created:
            self.stdout.write('Center created!')

        if not User.objects.filter(username='owner').exists():
            User.objects.create_superuser(
                username='owner',
                password='Trusta2024',
                role='owner',
                center=center
            )
            self.stdout.write('Owner created!')
        else:
            User.objects.filter(username='owner').update(center=center)
            self.stdout.write('Owner center updated!')

        if not User.objects.filter(username='admin1').exists():
            User.objects.create_user(
                username='admin1',
                password='Admin2024',
                role='admin',
                center=center
            )
            self.stdout.write('Admin created!')
        else:
            User.objects.filter(username='admin1').update(center=center)
            self.stdout.write('Admin center updated!')

        if not User.objects.filter(username='teacher1').exists():
            User.objects.create_user(
                username='teacher1',
                password='Teacher2024',
                role='teacher',
                first_name='Муаллим',
                last_name='Якум',
                center=center
            )
            self.stdout.write('Teacher created!')
        else:
            User.objects.filter(username='teacher1').update(center=center)
            self.stdout.write('Teacher center updated!')

        self.stdout.write('Done!')
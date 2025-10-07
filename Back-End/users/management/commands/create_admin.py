from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import Admin, UserProfile
import uuid  

class Command(BaseCommand):
    help = 'Create a superuser admin if not exists'

    def handle(self, *args, **options):
        if not User.objects.filter(username="Kabidu").exists():
            admin_user = User.objects.create_superuser(username="Kabidu", email="abidusage@gmail.com", password="Toujours#toucher")
            Admin.objects.create(user=admin_user)
            
            
            unique_phone = "+343977598156" + str(uuid.uuid4())

            UserProfile.objects.create(
                account=admin_user,
                title="",
                descriptions="",
                phone=unique_phone, 
                link_upwork="",
                link_github="",
                link_linkedin="",
                role="admin"
            )
            self.stdout.write(self.style.SUCCESS('Successfully created superuser "admin"'))
        else:
            self.stdout.write(self.style.WARNING('Superuser "admin" already exists'))

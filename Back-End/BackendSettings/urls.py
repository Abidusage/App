from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
    path('upload_profile_photo/', api.upload_profile_photo, name='upload_profile_photo'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

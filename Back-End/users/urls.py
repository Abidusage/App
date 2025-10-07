from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .api import (
    register, login, user_list, dashboard, get_specifique_resource, add_resource,
    get_all_profiles, detailprofile, get_all_resources, delete_resource, update_resource,
    update_role, update_roles, user_detail, global_search  
)

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/token/', login, name='login'),
    path('api/dashboard/', dashboard, name='dashboard'),
    path('api/detailprofile/', detailprofile, name='add_profile'),
    path('api/add_resource/', add_resource, name='add_resource'),
    path('api/resources/', get_all_resources, name='get_all_resources'),
    path('api/list_users/', user_list, name='user-list'),
    path('api/resources/<int:id>/', get_specifique_resource, name='list_resource'),
    path('api/resources/delete/<int:id>/', delete_resource, name='delete_resource'),
    path('api/resources/update/<int:id>/', update_resource, name='update_resource'),
    path('api/get_all_profiles/', get_all_profiles, name='get_all_profiles'),
    path('api/user/<int:user_id>/role/', update_role, name='update_role'),
    path('api/users/roles/', update_roles, name='update_roles'),
    path('api/user/<int:user_id>/', user_detail, name='user-detail'),
    path('api/search/', global_search, name='global-search')
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.http import HttpResponseForbidden
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)

DEFAULT_ADMIN_USERNAME = 'kabidu'  

def require_admin(view_func):
    def _wrapped_view_func(request, *args, **kwargs):
        if not request.user.is_authenticated:
            logger.warning("User is not authenticated")
            return HttpResponseForbidden("You do not have permission to access this page.")
        try:
            if request.user.username != DEFAULT_ADMIN_USERNAME and request.user.userprofile.role != 'admin':
                logger.warning(f"Apprenant {request.user.username} does not have admin role")
                return HttpResponseForbidden("You do not have permission to access this page.")
        except UserProfile.DoesNotExist:
            logger.warning(f"Apprenant {request.user.username} does not have a profile")
            return HttpResponseForbidden("You do not have a profile to access this page.")
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func

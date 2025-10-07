import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, ResourceSerializer, UserProfileSerializer
from .models import Resource, UserProfile, Admin
from .middleware import require_admin
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from django.db.models import Q

logger = logging.getLogger(__name__)

# views.py
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    user_profile = get_object_or_404(UserProfile, account=request.user)
    if 'profile_photo' in request.FILES:
        user_profile.profile_photo = request.FILES['profile_photo']
        user_profile.save()
        return JsonResponse({'profile_photo': user_profile.profile_photo.url})
    return JsonResponse({'error': 'Profile photo not provided'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    is_admin = Admin.objects.filter(user=user).exists()
    user_serializer = UserSerializer(user)
    user_data = user_serializer.data
    user_data['isAdmin'] = is_admin
    return Response({
        'message': 'Welcome to your dashboard',
        'user': user_data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    view = TokenObtainPairView.as_view()
    return view(request._request)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_profiles(request):
    profiles = UserProfile.objects.all()
    serializer = UserProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def detailprofile(request):
    user = request.user
    profile = get_object_or_404(UserProfile, account=user)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        role = getattr(profile, 'role', 'user')
        restricted_fields = ['role'] if role != 'admin' else []
        data = request.data.copy()
        for field in restricted_fields:
            data.pop(field, None)
        serializer = UserProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save(account=user) 
            return Response({
                'message': '✅ Profile updated successfully',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'error': '❌ Failed to update profile',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specifique_resource(request):
    user = request.user
    resource = Resource.objects.filter(author=user)
    serializerData = ResourceSerializer(resource, many=True).data
    return Response(serializerData)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_resources(request):
    resources = Resource.objects.all()
    serializerData = ResourceSerializer(resources, many=True).data
    return Response(serializerData)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_resource(request):
    try:
        profile = UserProfile.objects.get(account=request.user)
        if profile.role not in ['admin', 'allowed_role']:
            return Response({'error': 'You do not have permission to add resources'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ResourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user) 
    return Response(serializer.data)





@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_resource(request, id):
    user = request.user
    try:
        resource = Resource.objects.get(id=id, author=user)
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found or you do not have permission to delete this resource'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_resource(request, id):
    user = request.user
    try:
        resource = Resource.objects.get(id=id, author=user)
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found or you do not have permission to edit this resource'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ResourceSerializer(resource, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@require_admin
def update_role(request, user_id):
    try:
        logger.debug("Received request to update role")
        user = User.objects.get(id=user_id)
        if not hasattr(user, 'userprofile'):
            UserProfile.objects.create(
                account=user,
                title="User",
                descriptions="Profile for user " + user.username,
                link_upwork="upwork_" + str(user.id),
                link_github="github_" + str(user.id),
                link_linkedin="linkedin_" + str(user.id),
               
            )
            logger.warning("User had no profile, a new one was created")

        user.userprofile.role = request.data.get('role', 'user')
        user.userprofile.save()
        logger.debug("Role updated successfully")
        return Response({'message': 'Role updated successfully'})
    except User.DoesNotExist:
        logger.error("User not found")
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@require_admin
def update_roles(request):
    try:
        users_data = request.data.get('users', [])
        for user_data in users_data:
            user_id = user_data.get('id')
            new_role = user_data.get('role', 'user')
            user = User.objects.get(id=user_id)
            if not hasattr(user, 'userprofile'):
                UserProfile.objects.create(
                    account=user,
                    title="User",
                    descriptions="Profile for user " + user.username,
                    link_upwork="upwork_" + str(user.id),
                    link_github="github_" + str(user.id),
                    link_linkedin="linkedin_" + str(user.id),
                    
                )
            user.userprofile.role = new_role
            user.userprofile.save()
        return Response({'message': 'Roles updated successfully'})
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def global_search(request):
    query = request.GET.get('q', '').strip().lower()

    if not query:
        return Response({
            'error': "Le paramètre 'q' est requis pour effectuer une recherche."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        users = User.objects.filter(username__icontains=query)[:10]
        resources = Resource.objects.filter(
            Q(name__icontains=query) | Q(descriptions__icontains=query)
        )[:10]

        return Response({
            'groupedUsers': UserSerializer(users, many=True).data,
            'groupedResources': ResourceSerializer(resources, many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Erreur dans la recherche globale : {e}")
        return Response({
            'error': "Une erreur est survenue lors de la recherche.",
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




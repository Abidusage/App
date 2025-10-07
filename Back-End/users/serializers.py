from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Resource, UserProfile
from django.utils.text import slugify
import uuid

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'phone',
            'link_upwork',
            'link_github',
            'link_linkedin',
            'title',
            'descriptions',
            'role',
            'nickname',
            'profile_photo'
        ]
        read_only_fields = ['role', 'account'] 


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "Ce nom d'utilisateur est déjà pris."})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Cet email est déjà utilisé."})

        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            email=email,
            is_active=True
        )

        UserProfile.objects.create(
            account=user,
            title="User",
            descriptions=f"Profil public de {username}",
            phone=str(uuid.uuid4()),
            nickname=slugify(username),
            link_upwork=f"https://www.upwork.com/freelancers/~{username}",
            link_github=f"https://github.com/{username}",
            link_linkedin=f"https://www.linkedin.com/in/{username}",
            role="user",
            profile_photo="profile_photos/default.jpg"
        )
        return user


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']



class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']



class ResourceSerializer(serializers.ModelSerializer):
    author = UserMiniSerializer(read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id',
            'name',
            'categories',
            'descriptions',
            'link',
            'author',
            'created_at'
        ]
        read_only_fields = ['author']

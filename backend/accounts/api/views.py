
from django.contrib.auth import get_user_model, authenticate, logout, login
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from accounts.api.utils.type import getMethod
from accounts.models import Profile

from .serializers import (ProfileSerializer, ProfileListSerializer,
                          UserLanguageSerializer, LoginSerializer, UpdatePasswordSerializer)

from rest_framework.mixins import (
    CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, ListModelMixin, UpdateModelMixin)
from rest_framework.viewsets import GenericViewSet
from rest_framework.generics import CreateAPIView


User = get_user_model()


class LogoutView(APIView):

    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):

        logout(request)

        return Response({'message': 'You successfully logout'}, status=status.HTTP_200_OK)


class LoginViewSet(GenericViewSet, CreateAPIView):

    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'success': True, 'token': user.auth_token.key})
        else:
            return Response({'success': False, 'error_message': 'username or password incorrect'}, status=status.HTTP_400_BAD_REQUEST)


class CreateProfileViewSet(CreateModelMixin, GenericViewSet):

    serializer_class = ProfileListSerializer


class ProfileViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):

    # serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method.upper() in ['GET']:
            return ProfileListSerializer
        return ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


class UserProfileViewSet(ListModelMixin, GenericViewSet, RetrieveModelMixin):

    serializer_class = ProfileListSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = 'pk'

    def get_queryset(self):
        return Profile.objects.all()


class UpdatePasswordViewSet(GenericViewSet, CreateAPIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = UpdatePasswordSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not request.user.check_password(old_password):
            return Response({'message': 'old password don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'message': 'password is too short require atleast 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'message': 'password don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.set_password(new_password)
        user.save()

        if user.check_password(new_password):
            return Response({'message': 'password updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateLanguage(GenericViewSet, CreateModelMixin):

    permission_classes = (IsAuthenticated,)
    serializer_class = UserLanguageSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile = request.user.profile
        profile.lang = request.data.get('lang')
        profile.save()

        return Response({'message': 'Language Updated', 'profile': ProfileListSerializer(profile).data})


@api_view(['GET'])
def userExists(request, *args, **kwargs):
    if getMethod(request):
        field = kwargs['field']
        if field == 'username':
            f = User.objects.filter(username=kwargs['value'])
        elif field=='email':
            f = User.objects.filter(email=kwargs['value'])

        if f.exists():
            return Response({'message': f'a user with this {field} already exists found', 'found': True})
        else:
            return Response({'message': f'{field} not found', 'found': False})

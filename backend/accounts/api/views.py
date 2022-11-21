
import json

from dateutil import parser
from django.contrib.auth import get_user_model, authenticate, logout
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from django.shortcuts import get_object_or_404
from accounts.models import Profile

from django.db import transaction

from .serializers import (ProfileSerializer, ProfileListSerializer,
                          UserSerializer, LoginSerializer, UpdatePasswordSerializer)
from .utils import patchMethod, deleteMethod, getMethod, postMethod, putMethod
from rest_framework.mixins import (
    CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, ListModelMixin, UpdateModelMixin)
from rest_framework.viewsets import GenericViewSet
from rest_framework.generics import CreateAPIView

User = get_user_model()


class LogoutView(APIView):

    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):

        logout(request)

        return Response({'detail': 'You successfully logout'}, status=status.HTTP_200_OK)


class LoginViewSet(GenericViewSet, CreateAPIView):

    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):

        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({'success': True, 'token': user.auth_token.key})
        else:
            return Response({'success': False, 'error_message': 'username or password incorrect'}, status=status.HTTP_400_BAD_REQUEST)


class CreateProfileViewSet(CreateModelMixin, GenericViewSet):

    serializer_class = ProfileListSerializer


class ProfileViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


class ProfileList(GenericViewSet, RetrieveModelMixin, ListModelMixin, UpdateModelMixin, DestroyModelMixin):

    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.all()

class UpdatePasswordViewSet(GenericViewSet,CreateAPIView):

	permission_classes = (IsAuthenticated)
	serializer_class = UpdatePasswordSerializer

	def create(self, request, *args, **kwargs):

		errors = {}

		must_contain = ['old_password','new_password','confirm_password']

		# for (i,(k,v)) in enumerate(request.data.items()):
		# 	if k not in must_contain:

		# 	if not v:
		# 		pass
		old_password = request.data.get('old_password')
		new_password = request.data.get('new_password')
		confirm_password = request.data.get('confirm_password')


		return Response('Updated')
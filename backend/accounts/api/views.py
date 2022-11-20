
import json

from dateutil import parser
from django.contrib.auth import get_user_model,authenticate,logout
from rest_framework import authentication, permissions, status
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny,IsAdminUser,IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from django.shortcuts import get_object_or_404
from accounts.models import Profile

from django.db import transaction

from .serializers import ProfileSerializer, UserSerializer,LoginSerializer,UpdatePasswordSerializer
from .utils import patchMethod,deleteMethod, getMethod, postMethod, putMethod
from rest_framework.mixins import CreateModelMixin,RetrieveModelMixin,DestroyModelMixin,ListModelMixin,UpdateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView,DestroyAPIView

User = get_user_model()


class LogoutView(APIView):

	permission_classes = [IsAuthenticated,]

	def post(self,request,*args,**kwargs):

		logout(request)

		return Response({'detail':'You successfully logout'},status=status.HTTP_200_OK)

class LoginViewSet(GenericViewSet,CreateAPIView):

	serializer_class = LoginSerializer

	def post(self,request,*args,**kwargs):

		username = request.data.get('username')
		password = request.data.get('password')

		user = authenticate(username=username,password=password)
		if user is not None:
			return Response({'success':True,'token':user.auth_token.key})
		else:
			return Response({'success':False,'error_message':'username or password incorrect'},status=status.HTTP_400_BAD_REQUEST)


class CreateProfileViewSet(CreateModelMixin,GenericViewSet):

	serializer_class = ProfileSerializer


class ProfileViewSet(ListModelMixin,RetrieveModelMixin,UpdateModelMixin,DestroyModelMixin,GenericViewSet):

	serializer_class = ProfileSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return Profile.objects.filter(user=self.request.user)

	def partial_update(self, request, *args, **kwargs):
		
		d = ProfileSerializer().update(self.get_object(),request.data)
		print(d)

		
		return Response(ProfileSerializer(d).data)

class ProfileList(GenericViewSet,RetrieveModelMixin,ListModelMixin,UpdateModelMixin,DestroyModelMixin):

	permission_classes = (IsAuthenticated,IsAdminUser)
	serializer_class = ProfileSerializer

	def get_queryset(self):
		return Profile.objects.all()

	def update(self, request, *args, **kwargs):

		profile = self.get_object()
		serializer = ProfileSerializer(profile,data=request.data,partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)

	def partial_update(self, request, *args, **kwargs):
		return self.update(request,*args,**kwargs)

class ProfileDetail(APIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = ProfileSerializer

	def get_object(self,id):

		try:
			return Profile.objects.get(pk=id)
		except Profile.DoesNotExists:
			raise Http404
			# return Response({'success':False},status=status.HTTP_404_NOT_FOUND)

	def get(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)
		serializer = ProfileSerializer(profile)


		return Response({'success':True,'profile':serializer.data},status=status.HTTP_200_OK)

	def put(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)

		if request.user != profile.user:
			return Response({'detail':'You can not update a profile that doesn\'t belong to yow!'},status=status.HTTP_403_FORBIDDEN)

		serializer = ProfileSerializer(profile,data=request.data)

		if serializer.is_valid(raise_exception=True):
			serializer.save()

			return Response({'success':True,'profile':serializer.data},status=status.HTTP_200_OK)
		else:

			return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)

	def delete(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)
		if request.user != profile.user:
			return Response({'detail':'You can not delete a profile that doesn\'t belong to you!'},status=status.HTTP_403_FORBIDDEN)
		profile.delete()

		return Response({'success':True},status=status.HTTP_204_NO_CONTENT)



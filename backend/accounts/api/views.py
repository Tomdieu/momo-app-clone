
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework import authentication,permissions,status
from django.contrib.auth import get_user_model

from accounts.models import Profile

from .serializers import UserSerializer,ProfileSerializer

from .utils import (getMethod,deleteMethod,postMethod,putMethod)

User = get_user_model()

@api_view(['GET','POST'])
def user_list(request):

	if getMethod(request):

		user = User.objects.all()
		serializer = UserSerializer(user,many=True)

		return Response({'success':True,'users':serializer.data},status=status.HTTP_200_OK)

		
	elif postMethod(request):
		
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({'success':True,'user':serializer.data},status=status.HTTP_201_CREATED)

@api_view(['GET','PUT','DELETE'])
def user_detail(request,id):

	def get_object(id):

		try:
			user = User.objects.get(pk=id)
			return user
		except:
			return Response({"success":False},status==status.HTTP_404_NOT_FOUND)

	if getMethod(request):
		user = get_object(id)
		serializer = UserSerializer(user)

		return Response({'success':True,'user':serializer.data},status=status.HTTP_200_OK)

	elif putMethod(request):
		user = get_object(id)
		serializer = UserSerializer(user,data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({'success':True,'user':serializer.data},status=status.HTTP_200_OK)
		else:
			return Response({'success':False,'errors':serializer.error_messages},status=status.HTTP_404_NOT_FOUND)

	elif deleteMethod(request):
		user = get_object(id)
		user.delete()

		return Response({'success':True,'message':'User deleted'},status=status.HTTP_200_OK)


class ProfileList(APIView):

	def get(self,request,*args,**kwargs):

		profile = Profile.objects.all()
		serializer = ProfileSerializer(profile,many=True)

		return Response(data=serializer.data)

	
	def post(self,request,*args,**kwargs):
		serializer = ProfileSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(data=serializer.data)
		else:
			return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)

class ProfileDetail(APIView):

	def get_object(self,id):

		try:
			profile = Profile.objects.select_related('user').get(pk=id)
			return profile
		except:
			return Response({'success':False},status=status.HTTP_404_NOT_FOUND)

	def get(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)
		serializer = ProfileSerializer(profile)

		

		return Response({'success':True,'profile':serializer.data},status=status.HTTP_200_OK)

	def put(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)
		serializer = ProfileSerializer(profile,data=request.data)

		if serializer.is_valid():
			serializer.save()

			return Response({'success':True,'profile':serializer.data},status=status.HTTP_200_OK)

	def delete(self,request,id,*args,**kwargs):
		
		profile = self.get_object(id)
		profile.delete()

		return Response({'success':True},status=status.HTTP_200_OK)


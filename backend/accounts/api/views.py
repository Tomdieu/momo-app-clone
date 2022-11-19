
import re

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

from .serializers import ProfileSerializer, UserSerializer
from .utils import patchMethod,deleteMethod, getMethod, postMethod, putMethod

User = get_user_model()



class LoginView(APIView):

	permission_classes = ()
	authentication_classes = ()

	def post(self,request,*args,**kwargs):

		username = request.data.get('username')
		password = request.data.get('password')

		user = authenticate(username=username,password=password)
		if user is not None:
			return Response({'success':True,'token':user.auth_token.key})
		else:
			return Response({'success':False,'error_message':'username or password incorrect'},status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):

	permission_classes = [IsAuthenticated,]

	def post(self,request,*args,**kwargs):

		logout(request)

		return Response({'detail':'You successfully logout'},status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
	if getMethod(request):
		print(request.user)
		user = User.objects.all()
		serializer = UserSerializer(user,many=True)

		return Response({'success':True,'users':serializer.data},status=status.HTTP_200_OK)

@api_view(['POST'])
def user_create(request):	
	if postMethod(request):
		serializer = UserSerializer(data=request.data)
		
		if not request.data:
			serializer.is_valid(raise_exception=True)
			return Response({'success':False,'error':'Fields not provided!'},status=status.HTTP_400_BAD_REQUEST)

		dob = None
		phoneNumber = None
		city = None


		try:
			dob = parser.parse(request.data.get('dob')).date()
		except ValueError:
			return Response({'success':False,'error':'Invalid Date'},status=status.HTTP_400_BAD_REQUEST)
		
		# Pattern to match cameroon phone numbers
		if request.data.get('phone_number'):
			phoneNumberPtn = re.compile(r"(\+)?(237)?6(\d+){8}")
                                          
			if phoneNumberPtn.match(request.data.get('phone_number')):
				phoneNumber = request.data['phone_number']

		if request.data.get('city'):
			city = request.data['city']

		if serializer.is_valid(raise_exception=True):
			user = serializer.save()
			Profile.objects.create(user=user,phone_number=phoneNumber,dob=dob,city=city)
			
			return Response({'success':True,'user':serializer.data},status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH','POST','DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request,id):

	"""
	Retrieve, update or delete a user instance
	"""

	def get_object(id):

		return get_object_or_404(User,id=id)

	if getMethod(request):
		user = get_object(id)
		if request.user != user and request.user.is_superuser==False:
			return Response({'detail':'You are not allow'},status=status.HTTP_401_UNAUTHORIZED)
		
		serializer = UserSerializer(user)

		return Response({'success':True,'user':serializer.data},status=status.HTTP_200_OK)

	elif postMethod(request) or patchMethod(request):
		user = get_object(id)

		if request.user != user and request.user.is_superuser==False:
			return Response({'detail':'You are not allow'},status=status.HTTP_401_UNAUTHORIZED)
		
		serializer = UserSerializer(user,data=request.data,partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response({'success':True,'user':serializer.data},status=status.HTTP_200_OK)
		else:
			return Response({'success':False,'errors':serializer.errors},status=status.HTTP_404_NOT_FOUND)

	elif deleteMethod(request):
		user = get_object(id)
		if user != request.user:
			return Response({'detail':'You can\'t delete a user accounts which is not yours' },status=status.HTTP_403_FORBIDDEN)
		user.delete()

		return Response({'success':True,'message':'User deleted'},status=status.HTTP_204_NO_CONTENT)


class ProfileList(APIView):

	permission_classes = (IsAuthenticated,)
	serializer_class = ProfileSerializer

	def get(self,request,*args,**kwargs):

		profile = Profile.objects.all()
		serializer = ProfileSerializer(profile,many=True)

		return Response(data=serializer.data,status=status.HTTP_200_OK)

	
	def post(self,request,*args,**kwargs):
		serializer = ProfileSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(data=serializer.data,status=status.HTTP_201_CREATED)
		else:
			return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)

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



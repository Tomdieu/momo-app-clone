
from django.contrib.auth import get_user_model, authenticate, logout, login
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
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

        return Response({'message': 'You successfully logout','success':True}, status=status.HTTP_200_OK)


class LoginViewSet(GenericViewSet, CreateAPIView):

    permission_classes = [AllowAny,]

    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            profile = ProfileListSerializer(Profile.objects.get(user=request.user)).data
            return Response({'success': True, 'token': user.auth_token.key,'data':profile,'message':'Valid Credentials'})
        else:
            return Response({'success': False, 'message': 'username or password incorrect','data':[]}, status=status.HTTP_400_BAD_REQUEST)


class CreateProfileViewSet(CreateModelMixin, GenericViewSet):

    serializer_class = ProfileListSerializer

    def create(self,request,*args,**kwargs):

        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        instance = serializer.save()

        token = instance.user.auth_token.key

        return Response({'success':True,'token':token,'data':serializer.data,'message':'Welcome to trix wallet'},status=status.HTTP_201_CREATED)


class ProfileViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):

    # serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method.upper() in ['GET','PATCH']:
            return ProfileListSerializer
        return ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        serializer = ProfileListSerializer(instance=self.get_object())
        serializer.update(self.get_object(),request.data)
        return Response({'success':True,'data':serializer.data,'message':'Your profile has been updated'})
 
    def retrieve(self,request,*args,**kwargs):
        serializer = self.get_serializer_class()
        pk = kwargs.get('pk')
        queryset = self.get_queryset().filter(pk=pk)
        if queryset:
            return Response({'success':True,'data':serializer(queryset.first()).data,'message':'Your profile'})
        return Response({'success':False,'data':[],'message':'Not Found'},status=status.HTTP_400_BAD_REQUEST)


    def list(self,request,*args,**kwargs):

        serializer = self.get_serializer_class()
        queryset = self.get_queryset()
        return Response({'success':True,'data':serializer(queryset.first()).data,'message':'Your profile'})



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
            return Response({'success':False,'message': 'old password don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'success':False,'message': 'password is too short require atleast 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'success':False,'message': 'password don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.set_password(new_password)
        user.save()

        if user.check_password(new_password):
            return Response({'message': 'password updated successfully','success':True}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Something went wrong','success':False}, status=status.HTTP_400_BAD_REQUEST)


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

        return Response({'message': 'Language Updated', 'data': ProfileListSerializer(profile).data,'success':True})

    
@api_view(['GET'])
def userExists(request, *args, **kwargs):
    if getMethod(request):
        field = kwargs['field']
        if field == 'username':
            f = User.objects.filter(username=kwargs['value'])
        elif field=='email':
            f = User.objects.filter(email=kwargs['value'])
        elif field == 'phone_number':
            f = Profile.objects.filter(phone_number__icontains=kwargs['value'])
        if f.exists():
            return Response({'message': f'a user with this {field} already exists found', 'success': True})
        else:
            return Response({'message': f'{field} not found','success':False})

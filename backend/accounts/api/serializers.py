from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import Token

from accounts.models import Profile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email','password','is_active','is_staff','is_superuser','last_login','date_joined']
        extra_kwargs = {'password':{
            'write_only':True,
            'required':True
        }}
        
    def create(self,validate_data):
        user = User.objects.create_user(**validate_data)
        Token.objects.create(user=user)
        return user;

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile
        fields = '__all__'

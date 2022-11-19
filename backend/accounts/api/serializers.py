from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import Token

from accounts.models import Profile
from core.models import Account

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile
        fields = ['user','phone_number','dob','city','created_at','updated_at']


class UserSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email','password','is_active','is_staff','is_superuser','profile','last_login','date_joined']
        extra_kwargs = {'password':{
            'write_only':True,
            'required':True
        },
        'fist_name':{'required':True},
        'last_name':{'required':True},
        'email':{'required':True}
        }
        
    def create(self,validate_data):
        user = User.objects.create_user(**validate_data)
        user.is_active = True
        user.save()
        Token.objects.create(user=user)
        Account.objects.create(user=user)
        return user


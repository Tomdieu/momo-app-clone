from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import Token

from drf_writable_nested.serializers import WritableNestedModelSerializer

from accounts.models import Profile
from core.models import Account

User = get_user_model()


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=120,help_text='username of the account willing to login')
    password = serializers.CharField(max_length=120,help_text='password of the account willing to login')

class UpdatePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(max_length=120,help_text='old password')
    new_password = serializers.CharField(max_length=120,help_text='new password')
    confirm_password = serializers.CharField(max_length=120,help_text='confirmation of the new password')
    
    
class UserSerializer(serializers.ModelSerializer):

    # profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email','password','is_active','is_staff','is_superuser','last_login','date_joined']
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

    def update_user(self,instance,validated_data):
        serializer = UserSerializer(instance,data=validated_data,partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.save()
        # return super(UserSerializer,self).update(instance,validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:

        model = Profile
        fields = ['user','phone_number','dob','city','created_at','updated_at']
    

class ProfileListSerializer(WritableNestedModelSerializer):
    user = UserSerializer()
    class Meta:

        model = Profile
        fields = ['user','phone_number','dob','city','created_at','updated_at']

    def create(self, validated_data):
        user = validated_data.pop('user')
        serializer = UserSerializer(data=user)
        serializer.is_valid(raise_exception=True)
        user_instance = serializer.save()

        validated_data['user'] = user_instance

        return Profile.objects.create(**validated_data)

    def update(self,instance,validated_data):

        nested_serializer = self.fields['user']
        nested_instance = instance.user

        nested_data = validated_data.pop('user')

        nested_serializer.update_user(nested_instance,nested_data)

        return super(ProfileSerializer,self).update(instance,validated_data)
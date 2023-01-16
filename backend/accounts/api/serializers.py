from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone

from accounts.models import Profile
from core.models import Account
from notifications.models import Notification

from django.conf import settings

User = get_user_model()


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(
        max_length=120, help_text='username of the account willing to login')
    password = serializers.CharField(
        max_length=120, help_text='password of the account willing to login')


class UpdatePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(
        max_length=120, help_text='old password')
    new_password = serializers.CharField(
        max_length=120, help_text='new password')
    confirm_password = serializers.CharField(
        max_length=120, help_text='confirmation of the new password')

    class Meta:
        extra_kwargs = {'old_password': {'required': True}, 'new_password': {
            'required': True}, 'confirm_password': {'required': True}}


class UserSerializer(serializers.ModelSerializer):

    # profile = ProfileSerializer(required=False)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username','full_name' ,'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': True
            },
            'fist_name': {'required': True},
            'last_name': {'required': False},
            'email': {'required': True}
            }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_active = True
        user.save()
        return user

    def update_user(self, instance, validated_data):
        serializer = UserSerializer(
            instance, data=validated_data, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.save()
        # return super(UserSerializer,self).update(instance,validated_data)

    def get_full_name(self,obj:User):
        if obj:
            return obj.first_name + " " +obj.last_name
        return ''

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:

        model = Profile
        fields = '__all__'

        extra_kwargs = {
            'phone_number':{
                'required':True
            },
            'dob':{
                'required':True
            },
            'city':{
                'required':True
            }
        }


class ProfileListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:

        model = Profile
        fields = ['user', 'phone_number', 'dob',
                  'city','lang', 'created_at', 'updated_at']
        
        

    def create(self, validated_data):
        print(validated_data)

        user = validated_data.pop('user')
        serializer = UserSerializer(data=user)
        serializer.is_valid(raise_exception=True)
        user_instance = serializer.save()

        profile = Profile(**validated_data)
        profile.user = user_instance
        print(profile)
        profile.save()

        lang = profile.lang
        msg = ''

        if lang == 'FR':
            msg = f'Bienvenu sur {settings.APP_NAME}\nVotre code pin est [00000] et solde de votre compte est {profile.user.account.currency} {profile.user.account.balance}'
        elif lang == 'EN':
            msg = f'Welcome To {settings.APP_NAME} \nYour pin code is [00000] and account balance is {profile.user.account.currency} {profile.user.account.balance}'

        Notification.objects.create(user=profile.user, message=msg)

        return profile
        
         

    def update(self, instance, validated_data):
        print('Context : ',self.context)
        nested_serializer = self.fields['user']
        nested_instance = instance.user

        nested_data = validated_data.pop('user')

        nested_serializer.update_user(nested_instance, nested_data)

        return super(ProfileListSerializer, self).update(instance, validated_data)


class UserLanguageSerializer(serializers.ModelSerializer):
     class Meta:
        model = Profile
        fields = ['lang']
        extra_kwargs = {
            'lang':{
                'required':True
            }
        }


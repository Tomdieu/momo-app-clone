from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import Token

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

	class Meta:

		model = User
		fields = ('id','first_name','last_name','username','email','is_active','is_staff','is_superuser','date_joined','last_login')
		extra_kwargs = {'password':{
            'write_only':True,
            'required':True
        }}

    def create(self,validate_data):
        user = User.objects.create_user(**validate_data)
        Token.objects.create(user=user)
        return user;
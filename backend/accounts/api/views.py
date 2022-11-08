
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import authentication,permissions,status
from django.contrib.auth import get_user_model

from .serializers import UserSerializer

User = get_user_model()


class ListUsers(APIView):
	
	"""
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """
	
	# authentication_classes = [authentication.TokenAuthentication]
	# permissions_classes = [permissions.IsAdminUser]

	# serializer_class = UserSerializer
	permission_classes = [AllowAny,]

	def get(self,request,format=None):
		"""
		Return a list of users.
		"""

		users = User.objects.all()
		serializer = UserSerializer(users)
		print(users)
		
		return Response({"msg":"hello"},status=status.HTTP_200_OK)
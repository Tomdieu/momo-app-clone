from django.urls import path,include


urlpatterns = [
	path('auth/',include('accounts.api.urls'),name='auth'),
]
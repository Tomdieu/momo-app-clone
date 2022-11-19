from django.urls import path,include


urlpatterns = [
	path('accounts/',include('accounts.api.urls'),name='accounts'),
]
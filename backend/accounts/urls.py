from django.urls import path,include

from . import views

urlpatterns = [
	# path('auth/',include('accounts.api.urls'),name='auth'),
	path('',views.LandingPage.as_view(),name='index')
]
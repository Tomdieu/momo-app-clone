from django.urls import path,include

from . import views

urlpatterns = [
	# path('auth/',include('accounts.api.urls'),name='auth'),
	path('',views.LandingPage.as_view(),name='index'),
	path('profile/',views.CreateProfile.as_view()),
	path('login/',views.LoginPage.as_view())
]
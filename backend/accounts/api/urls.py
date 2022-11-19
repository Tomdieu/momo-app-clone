from django.urls import path
from .views import (user_list,user_detail,ProfileList,ProfileDetail,LoginView,user_create,LogoutView)

urlpatterns = [
	path('users/',user_list,name='users'),
	path('users',user_create,name="user-create"),
	path('users/<int:id>/',user_detail,name="user-detail"),
	path('profile/',ProfileList.as_view(),name='profile'),
	path('profile/<int:id>/',ProfileDetail.as_view(),name='profile-detail'),
	path('login/',LoginView.as_view(),name='login'),
	path('logout/',LogoutView.as_view(),name='logout')
]
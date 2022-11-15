from django.urls import path
from .views import user_list,user_detail,ProfileList,ProfileDetail

urlpatterns = [
	path('users',user_list),
	path('users/<int:id>/',user_detail),
	path('profile',ProfileList.as_view()),
	path('profile/<int:id>/',ProfileDetail.as_view())
]
from django.urls import path,include
from .views import ListUsers
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users',ListUsers)

urlpatterns = [
	path('',include(router.urls))
]
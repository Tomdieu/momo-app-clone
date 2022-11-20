from django.urls import path
from .views import (ProfileList,
                    LogoutView, LoginViewSet, ProfileViewSet,
                    CreateProfileViewSet)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('profile', ProfileViewSet, basename='users')
router.register('create-account', CreateProfileViewSet,
                basename='create profile')
router.register('login', LoginViewSet, basename="login")
router.register('profiles', ProfileList, basename="user-profiles")

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout')
]

urlpatterns += router.urls

from django.urls import path
from .views import (LogoutView, LoginViewSet, ProfileViewSet,
                    CreateProfileViewSet,UpdatePasswordViewSet,UpdateLanguage,UserProfileViewSet)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('profile', ProfileViewSet, basename='users')
router.register('user-profiles',UserProfileViewSet,basename='user-profile')
router.register('create-account', CreateProfileViewSet,
                basename='create profile')
router.register('login', LoginViewSet, basename="login")
router.register('update-password',UpdatePasswordViewSet,basename='updated-password')
router.register('update-language',UpdateLanguage,basename='language')

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout'),
]

urlpatterns += router.urls

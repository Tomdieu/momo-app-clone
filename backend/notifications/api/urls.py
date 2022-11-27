from django.urls import path,include

from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('',views.NotificationsViewSets.as_view({'get':'list'}))
]

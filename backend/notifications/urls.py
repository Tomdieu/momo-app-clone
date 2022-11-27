from django.urls import path

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('notifications',views.NotificationsViewSets,basename="notifications")

urlpatterns = [

]

urlpatterns += router.urls
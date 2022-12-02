from django.urls import path,include

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('',views.NotificationsViewSets,basename='notifications')

urlpatterns = [
    path('',include(router.urls))
    # path('notifications/',views.NotificationsViewSets.as_view({'get':'list'}))
]

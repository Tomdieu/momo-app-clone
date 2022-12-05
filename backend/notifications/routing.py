from django.urls import re_path,path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\d+)/',consumers.UserNotification.as_asgi()),
    path('ws/notifications/<int:id>/',consumers.UserNotification.as_asgi())
]
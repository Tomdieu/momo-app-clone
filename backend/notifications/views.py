from django.shortcuts import render

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin

from .models import Notification
from .serializers import NotificationSerializer
# Create your views here.


class NotificationsViewSets(ListModelMixin,GenericViewSet):

    serializer_class = NotificationSerializer
    permission_class = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

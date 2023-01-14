from rest_framework.permissions import IsAuthenticated

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin,DestroyModelMixin
from rest_framework.response import Response

from notifications.models import Notification
from .serializers import NotificationSerializer
# Create your views here.


class NotificationsViewSets(ListModelMixin,GenericViewSet,DestroyModelMixin):

    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user,deleted=False)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response({'success':True,'data':serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted = True
        instance.save()
        return Response({'success':True,'message':'deleted'})

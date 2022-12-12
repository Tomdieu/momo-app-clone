from django.db import models
from django.contrib.auth import get_user_model

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import asyncio
import json

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save


# Create your models here.

User = get_user_model()


class Notification(models.Model):

    NOTIFICATION_TYPE = (
        ('NORMAL', 'NORMAL'),
        ('TRANSFER', 'TRANSFER'),
        ('TRANSFER_SUCCESSFULL', 'TRANSFER_SUCCESSFULL'),
        ('TRANSFER_REJECTED', 'TRANSFER_REJECTED'),
        ('WITHDRAW', 'WITHDRAW'),
        ('WITHDRAW_REJECTED', 'WITHDRAW_REJECTED'),
        ('WITHDRAW_CANCEL', 'WITHDRAW_CANCEL'),
        ('WITHDRAW_SUCCESSFULL', 'WITHDRAW_SUCCESSFULL'),
        ('WITHDRAW_CANCEL', 'WITHDRAW_CANCEL'),
        ('ACCOUNT_EMPTY', 'ACCOUNT_EMPTY'),
        ('ALERT', 'ALERT')
    )

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user_notifications')
    message = models.TextField(max_length=800)
    type = models.CharField(
        max_length=20, choices=NOTIFICATION_TYPE, default='NORMAL')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} notification'

    
# signals for notification


@receiver(post_save, sender=Notification)
def sendSocketNotifications(sender, instance, created, **kwargs):
    from notifications.api.serializers import NotificationSerializer

    channel_layer = get_channel_layer()

    if created:
        n = NotificationSerializer(instance)

        async_to_sync(channel_layer.group_send)(f'notifications_{instance.user.id}', {
            'type': 'send_notification', 'message': json.dumps(n.data)})

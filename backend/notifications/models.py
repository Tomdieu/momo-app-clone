from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Notification(models.Model):

    NOTIFICATION_TYPE = (
        ('NORMAL','NORMAL'),
        ('TRANSFER','TRANSFER'),
        ('TRANSFER_SUCCESSFULL','TRANSFER_SUCCESSFULL'),
        ('TRANSFER_REJECTED','TRANSFER_REJECTED'),
        ('WITHDRAW', 'WITHDRAW'),
        ('WITHDRAW_REJECTED','WITHDRAW_REJECTED'),
        ('WITHDRAW_CANCEL','WITHDRAW_CANCEL'),
        ('WITHDRAW_SUCCESSFULL','WITHDRAW_SUCCESSFULL'),
        ('WITHDRAW_CANCEL', 'WITHDRAW_CANCEL'),
        ('ACCOUNT_EMPTY','ACCOUNT_EMPTY'),
        ('ALERT','ALERT')
    )

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    message = models.TextField(max_length=800)
    type = models.CharField(max_length=20,choices=NOTIFICATION_TYPE)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
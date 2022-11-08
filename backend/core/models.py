from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Account(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE)
    balance = models.BigIntegerField(default=0)
    account_status = models.CharField(max_length=255)
    currency = models.CharField(max_length=3)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.user


class Transaction(models.Model):

    transaction_type = models.CharField(max_length=255)
    from_account = models.ForeignKey(Account,on_delete=models.CASCADE,related_name="from_account")
    to_account = models.ForeignKey(Account,on_delete=models.CASCADE,related_name="to_account")

    date_issue = models.DateField(auto_now=True)
    ammount = models.BigIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return  self.transaction_type
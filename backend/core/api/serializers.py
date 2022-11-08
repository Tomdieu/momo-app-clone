from rest_framework import serializers
from  core.models import Account,Transaction

class AccountSerializer(serializers.ModelSerializer):

	class Meta:

		model = Account

		fields = ('id','user','balance','account_status','currency','created_at','updated_at')


class TransactionSerializer(serializers.ModelSerializer):

	class Meta:

		model = Transaction

		fields = ('id','transaction_type','from_account','to_account','date_issue','ammount','created_at')
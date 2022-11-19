from rest_framework import serializers

from accounts.api.serializers import UserSerializer


from  core.models import Account,TransactionCharge,TransactionType,Transfer,Deposit,Withdraw

class AccountSerializer(serializers.ModelSerializer):

	user = UserSerializer()

	class Meta:

		model = Account
		fields = '__all__'
		# fields = ('id','user','balance','is_agent','account_status','currency','created_at','updated_at')

class DepositSerializer(serializers.ModelSerializer):

	deposit_from = AccountSerializer()
	desposit_to = AccountSerializer()

	class Meta:

		model = Deposit

		fields = '__all__'

class TransactionTypeSerializer(serializers.ModelSerializer):

	class Meta:
		model = TransactionType	
		fields = '__all__'

class TransactionChargeSerializer(serializers.ModelSerializer):

	type = TransactionTypeSerializer()

	class Meta:
		model = TransactionCharge
		fields = '__all__'

class Transferserializer(serializers.ModelSerializer):

	sender = AccountSerializer()
	reciever = AccountSerializer()
	charge = TransactionChargeSerializer()

	class Meta:
		model = Transfer
		fields = '__all__'

class WithdrawSerializer(serializers.ModelSerializer):

	withdraw_from = AccountSerializer()
	agent= AccountSerializer()
	withdraw_charge = TransactionChargeSerializer()

	class Meta:
		model = Withdraw
		fields = '__all__'
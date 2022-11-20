from rest_framework import serializers

from accounts.api.serializers import UserSerializer


from  core.models import Account,TransactionCharge,TransactionType,Transfer,Deposit,Withdraw

class AccountSerializer(serializers.ModelSerializer):

	class Meta:

		model = Account
		fields = '__all__'
class AccountListSerializer(AccountSerializer):

	user = UserSerializer()

	class Meta:

		model = Account
		fields = '__all__'

class DepositSerializer(serializers.ModelSerializer):

	class Meta:

		model = Deposit

		fields = '__all__'
class DepositListSerializer(DepositSerializer):

	deposit_from = AccountSerializer()
	desposit_to = AccountSerializer()


class TransactionTypeSerializer(serializers.ModelSerializer):

	class Meta:
		model = TransactionType	
		fields = '__all__'

class TransactionListChargeSerializer(serializers.ModelSerializer):

	type = TransactionTypeSerializer()

	class Meta:
		model = TransactionCharge
		fields = '__all__'

class TransactionChargeSerializer(serializers.ModelSerializer):

	class Meta:

		model = TransactionCharge
		fields = '__all__'


class TransferSerializer(serializers.ModelSerializer):

	class Meta:
		model = Transfer
		fields = '__all__'

class TransferListserializer(TransferSerializer):

	sender = AccountSerializer()
	reciever = AccountSerializer()
	charge = TransactionChargeSerializer()
class WithdrawSerializer(serializers.ModelSerializer):

	class Meta:
		model = Withdraw
		fields = '__all__'

class WithdrawListSerializer(WithdrawSerializer):

	withdraw_from = AccountSerializer()
	agent= AccountSerializer()
	withdraw_charge = TransactionChargeSerializer()

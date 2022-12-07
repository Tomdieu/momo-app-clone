from rest_framework import serializers

from accounts.api.serializers import UserSerializer

from core.api.utils import converCurrency

from  core.models import Account,TransactionCharge,TransactionType,Transfer,Withdraw

class AccountSerializer(serializers.ModelSerializer):

	convertedCurrency = serializers.SerializerMethodField()

	class Meta:

		model = Account
		fields = '__all__'

		extra_kwargs = {
			'pin_code':{
				'write_only':True
			}
		}
	@property
	def get_convertedCurrency(self,obj:Account):
		return converCurrency(obj.currency,obj.display_currency,obj.balance)
class AccountListSerializer(AccountSerializer):

	user = UserSerializer()
	convertedCurrency = serializers.SerializerMethodField()

	class Meta:

		model = Account
		fields = '__all__'

		extra_kwargs = {
			'pin_code':{
				'write_only':True
			}
		}

	def convertedCurrency(self,obj:Account):

		return converCurrency(obj.currency,obj.display_currency,obj.balance)
class ChangePinSerializer(serializers.Serializer):

	old_pin = serializers.CharField(max_length=50,help_text='The old pin account')
	new_pin = serializers.CharField(max_length=50,help_text='The new pin account')
	confirm_pin = serializers.CharField(max_length=50,help_text='The confirm new pin account')

	class Meta:
		extra_kwargs = {
			'old_pin':{
				'required':True
			},
			'new_pin':{
				'required':True
			},'confirm_pin':{
				'required':True
			}
		}

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



class TransferCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Transfer
		fields = '__all__'

		extra_kwargs = {
			'status':{
				'read_only':True
			}
		}

	pin_code = serializers.CharField(max_length=5,help_text="This pin code represent the pin code to the account transfering the money")
	

	def create(self, validated_data):

		validated_data.pop('pin_code')
		print(validated_data)
		transfer = Transfer.objects.create(**validated_data)

		return transfer

class TransferSerializer(serializers.ModelSerializer):

	class Meta:
		model = Transfer
		fields = '__all__'

		extra_kwargs = {
			'status':{
				'read_only':True
			}
		}


class TransferListSerializer(TransferSerializer):

	sender = AccountSerializer()
	reciever = AccountSerializer()
	charge = TransactionListChargeSerializer()


class WithdrawCreateSerializer(serializers.ModelSerializer):

	pin_code = serializers.CharField(max_length=5,help_text="This pin code represent the pin code to the account initiating the withdrawal")

	class Meta:
		model = Withdraw
		fields = '__all__'

		extra_kwargs = {
			'state':{
				'read_only':True
			},
			'charge':{
				'read_only':True
			}
		}
class WithdrawSerializer(serializers.ModelSerializer):

	class Meta:
		model = Withdraw
		fields = '__all__'

		

class WithdrawListSerializer(WithdrawSerializer):

	withdraw_from = AccountSerializer()
	agent= AccountSerializer()
	charge = TransactionListChargeSerializer()


class ConvertCurrencySerializer(serializers.Serializer):

	from_currency = serializers.CharField(max_length=3)
	to_currency = serializers.CharField(max_length=3)
	amount = serializers.FloatField()

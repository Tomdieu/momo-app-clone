from rest_framework import serializers

from rest_framework.fields import CurrentUserDefault

from accounts.api.serializers import UserSerializer

from core.api.utils import converCurrency

from  core.models import Account,TransactionCharge,TransactionType,Transfer,Withdraw,Deposit

from django.db.models import Q,Sum


class AccountSerializer(serializers.ModelSerializer):

	class Meta:

		model = Account
		fields = '__all__'

		extra_kwargs = {
			'pin_code':{
				'write_only':True
			}
		}

	converted_currency = serializers.SerializerMethodField()
	total_amount_transfer = serializers.SerializerMethodField()
	total_amount_recieve = serializers.SerializerMethodField()
	total_amount_withdraw = serializers.SerializerMethodField()

	def get_converted_currency(self,obj:Account):
		
		if obj:
			r = converCurrency(obj.currency,obj.display_currency,obj.balance)
			return f'{obj.currency} {r}'
		return ''

	def get_total_amount_transfer(self,obj:Account):
		T = Transfer.objects.filter(sender=obj,status='SUCCESSFULL').aggregate(Sum('amount')) 
		D = Deposit.objects.filter(sender=obj,status='SUCCESSFULL').aggregate(Sum('amount'))

		t = 0
		d = 0
		if T.get('amount__sum') is not None:
			t = T.get('amount__sum')
		if D.get('amount__sum') is not None:
			d = D.get('amount__sum')
		total = int(t) + int(d)

		return total

	def get_total_amount_withdraw(self,obj:Account):
		W = Withdraw.objects.filter(withdraw_from=obj,state='ACCEPTED').aggregate(Sum('amount'))

		w = 0

		if W.get('amount__sum') is not None:
			w = W.get('amount__sum')

		return w

	def get_total_amount_recieve(self,obj:Account):
		T = Transfer.objects.filter(reciever=obj,status='SUCCESSFULL').aggregate(Sum('amount')) 
		D = Deposit.objects.filter(reciever=obj,status='SUCCESSFULL').aggregate(Sum('amount'))
		W = Withdraw.objects.filter(agent=obj,state='ACCEPTED').aggregate(Sum('amount'))

		t,d,w = 0,0,0

		if T.get('amount__sum') is not None:
			t = T.get('amount__sum')

		if D.get('amount__sum') is not None:
			d = D.get('amount__sum')

		if W.get('amount__sum') is not None:
			w = W.get('amount__sum')

		return t + d + w


class AccountListSerializer(AccountSerializer):

	user = UserSerializer()

	class Meta:

		model = Account
		fields = '__all__'

		extra_kwargs = {
			'pin_code':{
				'write_only':True
			}
		}


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
			},
			'sender':{
				'read_only':True
			}
		}

	pin_code = serializers.CharField(max_length=5,help_text="This pin code represent the pin code to the account transfering the money")
	

	def create(self, validated_data):

		validated_data.pop('pin_code')
		print(validated_data)
		validated_data['sender'] = self.context['request'].user.account
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

	sender = AccountListSerializer()
	reciever = AccountListSerializer()
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
			},
			'agent':{
				'read_only':True
			}
		}

	def create(self, validated_data):

		validated_data.pop('pin_code')

		validated_data['agent'] = self.context['request'].user.account
		withdraw = Withdraw.objects.create(**validated_data)

		return withdraw


class WithdrawSerializer(serializers.ModelSerializer):

	class Meta:
		model = Withdraw
		fields = '__all__'
		

class WithdrawListSerializer(WithdrawSerializer):

	sender = serializers.SerializerMethodField()
	reciever = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	withdraw_from = AccountListSerializer()
	agent= AccountListSerializer()

	charge = TransactionListChargeSerializer()

	def get_sender(self,obj:Withdraw):
		return AccountListSerializer(obj.withdraw_from).data

	def get_reciever(self,obj:Withdraw):
		return AccountListSerializer(obj.agent).data

	def get_fields(self):
		fields =  super().get_fields()

		# here what is i am doing is that is am removinf the field ['withdraw_from','agent']
		for field in ['withdraw_from','agent']:
			fields.pop(field,None)

		return fields

	def get_status(self,obj:Withdraw):
		return obj.state

	class Meta:
		model = Withdraw
		# exclude = ['withdraw_from','agent']
		fields = '__all__'
		
		extra_kwargs = {
			'withdraw_from':{
				'read_only':True
			},
			'agent':{
				'read_only':True
			}
		}

class CreateDepositSerializer(serializers.ModelSerializer):

	pin_code = serializers.CharField(max_length=5,help_text="This pin code represent the pin code to the account initiating the withdrawal")

	class Meta:
		model = Deposit
		fields = '__all__'

		extra_kwargs = {
			'status':{
				'read_only':True
			},
			'sender':{
				'read_only':True
			}
		}

	def create(self, validated_data):

		validated_data.pop('pin_code')
		validated_data['sender'] = self.context['request'].user.account
		deposit = Deposit.objects.create(**validated_data)

		return deposit

class DepositSerializer(serializers.ModelSerializer):

	class Meta:
		model = Deposit
		fields = '__all__'
	

class DepositListSerializer(serializers.ModelSerializer):
	
	sender = AccountListSerializer()
	reciever = AccountListSerializer()
	charge = TransactionListChargeSerializer()

	class Meta:
		model = Deposit
		fields = '__all__'

class ConvertCurrencySerializer(serializers.Serializer):

	from_currency = serializers.CharField(max_length=3)
	to_currency = serializers.CharField(max_length=3)
	amount = serializers.FloatField()

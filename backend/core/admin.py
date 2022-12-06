from django.contrib import admin
from core.api.utils import converCurrency
from django.http.response import HttpResponse
from django.core import serializers

from .api.serializers import AccountSerializer
from rest_framework.response import Response
# Register your models here.

from .models import Account,TransactionType,TransactionCharge,Transfer,Withdraw




class AccountAdmin(admin.ModelAdmin):

	list_display = ('user','is_agent','amount','convertedAmount','account_status','display_currency')
	list_filter=('balance','account_status')
	readonly_fields = ('currency','user') 

	search_fields = ('user__username','currency','account_status',)
	list_per_page = 25

	actions = ['to_agent','make_inactive','make_active']

	@admin.display(description="Account Balance",ordering='-created_at')
	def amount(self,obj):
		return f'{obj.currency} {obj.balance}'

	@admin.display(description='Balance Converted',ordering='-created_at')
	def convertedAmount(self,obj:Account):
		return f'{obj.display_currency} {converCurrency(obj.currency,obj.display_currency,obj.balance)}'

	# Account Actions

	@admin.action(description="Set Account As Agent")
	def to_agent(self,request,queryset):
		queryset.update(is_agent=True)

	@admin.action
	def make_inactive(self, request, queryset):
		queryset.update(account_status='inactive')

	@admin.action
	def make_active(self, request, queryset):
		queryset.update(account_status='active')


admin.site.register(Account,AccountAdmin)

class TransactionTypeAdmin(admin.ModelAdmin):
	list_display = ('name','description')

admin.site.register(TransactionType,TransactionTypeAdmin)

class TransactionChargeAdmin(admin.ModelAdmin):
	@admin.display
	def transaction_type(self,obj):
		return obj.type.name

	list_display = ('transaction_type','charge')

	search_fields = ('type__name','charge')
	

admin.site.register(TransactionCharge,TransactionChargeAdmin)

class TransferAdmin(admin.ModelAdmin):
	
	list_display = ('id','code','sender','reciever','status','transaction_amount','created_at')
	search_fields = ('code','sender__user__username','reciever__user__username')
	readonly_fields = ('code','currency')

	@admin.display
	def transaction_amount(self,obj):
		return f"{obj.currency} {obj.amount}"

admin.site.register(Transfer,TransferAdmin)

class WithdrawAdmin(admin.ModelAdmin):
	
	list_display = ('id','code','withdraw_from','agent','amount','state','created_at')

admin.site.register(Withdraw,WithdrawAdmin)
from django.contrib import admin
# Register your models here.

from .models import Account,TransactionType,TransactionCharge,Transfer,Withdraw


class AccountAdmin(admin.ModelAdmin):

	list_display = ('id','user','is_agent','amount','account_status','currency')
	list_filter=('balance','account_status')

	search_fields = ('user__username','currency','account_status',)
	list_per_page = 25

	@admin.display
	def amount(self,obj):
		return f'{obj.currency} {obj.balance}'


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
	
	list_display = ('id','code','sender','reciever','transaction_amount','created_at')
	search_fields = ('code','sender__user__username','reciever__user__username')

	@admin.display
	def transaction_amount(self,obj):
		return f"{obj.currency} {obj.amount}"

admin.site.register(Transfer,TransferAdmin)

class WithdrawAdmin(admin.ModelAdmin):
	
	list_display = ('id','code','withdraw_from','agent','amount','state','created_at')

admin.site.register(Withdraw,WithdrawAdmin)
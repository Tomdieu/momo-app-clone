from django.contrib import admin
# Register your models here.

from .models import Account,TransactionType,TransactionCharge,Transfer,Withdraw,Deposit


class AccountAdmin(admin.ModelAdmin):

	list_display = ('id','user','is_agent','amount','account_status','currency')
	list_filter=('balance','currency','account_status')

	search_fields = ('user__username','currency','account_status',)
	list_per_page = 25

	@admin.display
	def amount(self,obj):
		return f'{obj.currency} {obj.balance}'


admin.site.register(Account,AccountAdmin)

class TransactionTypeAdmin(admin.ModelAdmin):

	pass

admin.site.register(TransactionType,TransactionTypeAdmin)

class TransactionChargeAdmin(admin.ModelAdmin):
	pass

admin.site.register(TransactionCharge,TransactionChargeAdmin)

class TransferAdmin(admin.ModelAdmin):
	pass

admin.site.register(Transfer,TransferAdmin)

class WithdrawAdmin(admin.ModelAdmin):
	pass

admin.site.register(Withdraw,WithdrawAdmin)

class DepositAdmin(admin.ModelAdmin):
	pass

admin.site.register(Deposit,DepositAdmin)
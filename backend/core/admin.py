from django.contrib import admin

# Register your models here.

from .models import Account,Transaction


class AccountAdmin(admin.ModelAdmin):

	list_display = ('id','user','balance','account_status','currency')
	list_filter=('balance','currency','account_status')

admin.site.register(Account,AccountAdmin)

class TransactionAdmin(admin.ModelAdmin):

	list_display = ('id','transaction_type','from_account','to_account','ammount','date_issue')
	list_filter = ('from_account','to_account','ammount','date_issue')

admin.site.register(Transaction,TransactionAdmin)
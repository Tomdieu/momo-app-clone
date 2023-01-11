from django.contrib import admin
from core.api.utils import converCurrency
from django.http.response import HttpResponse
from django.core import serializers

from django.conf import settings
from django.contrib import messages
# Register your models here.

from .models import Account, TransactionType, TransactionCharge, Transfer, Withdraw, Deposit


class AccountAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', 'account_number', 'is_agent',
                    'amount', 'convertedAmount', 'account_status')
    list_filter = ('balance', 'account_status')
    # readonly_fields = ('currency', 'user', 'pin_code', 'account_number')
    readonly_fields = ('account_number',)

    search_fields = ('user__username', 'currency', 'account_status',)
    list_per_page = 25

    actions = ['to_agent', 'to_normal', 'make_inactive', 'make_active',
               'reset_pin', 'reset_balance', 'formalise_account_number']

    @admin.display(description="Account Balance", ordering='-created_at')
    def amount(self, obj):
        return f'{obj.currency} {obj.balance}'

    @admin.display(description='Balance Converted', ordering='-created_at')
    def convertedAmount(self, obj: Account):
        return f'{obj.display_currency} {converCurrency(obj.currency,obj.display_currency,obj.balance)}'

    # Account Actions

    @admin.action(description="Switch To agent account")
    def to_agent(self, request, queryset):
        queryset.update(is_agent=True)

        for acc in queryset:
            messages.add_message(request, messages.SUCCESS,
                                 '%s is now an agent' % acc)

    @admin.action(description="Switch to normal account")
    def to_normal(self, request, queryset):
        queryset.update(is_agent=False)

        for acc in queryset:
            messages.add_message(request, messages.SUCCESS,
                                 '%s is now normal' % acc)

    @admin.action(description='Make account inactive')
    def make_inactive(self, request, queryset):
        queryset.update(account_status='inactive')

    @admin.action(description='Make account active')
    def make_active(self, request, queryset):
        queryset.update(account_status='active')

    @admin.action(description='Reset Account pin code')
    def reset_pin(self, request, queryset):
        from notifications.models import Notification

        for acc in queryset:
            if acc.pin_code != settings.WALLET_DEFAULT_PIN_CODE:
                Notification.objects.create(
                    user=acc.user, message=f"Account pin code reset successfully to {settings.WALLET_DEFAULT_PIN_CODE} please change your pin code")

        queryset.update(pin_code=settings.WALLET_DEFAULT_PIN_CODE)

    @admin.action(description='Reset account balance')
    def reset_balance(self, request, queryset):
        queryset.update(balance=0)

    @admin.action(description='Formalise account number')
    def formalise_account_number(self, request, queryset):

        for acc in queryset:
            acc.account_number = 1000000 + acc.id
            acc.save()


admin.site.register(Account, AccountAdmin)


class TransactionTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    list_per_page = 25


admin.site.register(TransactionType, TransactionTypeAdmin)


class TransactionChargeAdmin(admin.ModelAdmin):
    @admin.display
    def transaction_type(self, obj):
        return obj.type.name

    list_display = ('transaction_type', 'charge')
    list_per_page = 25

    search_fields = ('type__name', 'charge')


admin.site.register(TransactionCharge, TransactionChargeAdmin)


class TransferAdmin(admin.ModelAdmin):

    list_display = ('id', 'code', 'sender', 'reciever',
                    'status', 'transaction_amount', 'created_at')
    search_fields = ('code', 'sender__user__username',
                     'reciever__user__username')
    readonly_fields = ('code', 'currency', 'status')
    list_per_page = 25

    @admin.display
    def transaction_amount(self, obj):
        return f"{obj.currency} {obj.amount}"


admin.site.register(Transfer, TransferAdmin)


class DepositAdmin(admin.ModelAdmin):

    list_display = ('id', 'code', 'sender', 'reciever',
                    'status', 'transaction_amount', 'created_at')
    search_fields = ('code', 'sender__user__username',
                     'reciever__user__username')
    readonly_fields = ('code', 'currency', 'status')
    list_per_page = 25

    @admin.display
    def transaction_amount(self, obj):
        return f"{obj.currency} {obj.amount}"


admin.site.register(Deposit, DepositAdmin)


class WithdrawAdmin(admin.ModelAdmin):

    list_display = ('id', 'code', 'withdraw_from', 'agent',
                    'amount', 'state', 'created_at')


admin.site.register(Withdraw, WithdrawAdmin)

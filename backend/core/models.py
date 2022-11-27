from django.db import models
from django.db.models.signals import pre_save, post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from core.api.utils import converCurrency
from .validators import IsAgent

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from django.db import transaction

import uuid
import binascii
import os
import datetime

from accounts.models import Profile
from rest_framework.authtoken.models import Token


User = get_user_model()


class Account(models.Model):

    CURRENCY = [('USD', 'USD'), ('AED', 'AED'), ('AFN', 'AFN'), ('ALL', 'ALL'), ('AMD', 'AMD'), ('ANG', 'ANG'), ('AOA', 'AOA'), ('ARS', 'ARS'), ('AUD', 'AUD'), ('AWG', 'AWG'), ('AZN', 'AZN'), ('BAM', 'BAM'), ('BBD', 'BBD'), ('BDT', 'BDT'), ('BGN', 'BGN'), ('BHD', 'BHD'), ('BIF', 'BIF'), ('BMD', 'BMD'), ('BND', 'BND'), ('BOB', 'BOB'), ('BRL', 'BRL'), ('BSD', 'BSD'), ('BTN', 'BTN'), ('BWP', 'BWP'), ('BYN', 'BYN'), ('BZD', 'BZD'), ('CAD', 'CAD'), ('CDF', 'CDF'), ('CHF', 'CHF'), ('CLP', 'CLP'), ('CNY', 'CNY'), ('COP', 'COP'), ('CRC', 'CRC'), ('CUP', 'CUP'), ('CVE', 'CVE'), ('CZK', 'CZK'), ('DJF', 'DJF'), ('DKK', 'DKK'), ('DOP', 'DOP'), ('DZD', 'DZD'), ('EGP', 'EGP'), ('ERN', 'ERN'), ('ETB', 'ETB'), ('EUR', 'EUR'), ('FJD', 'FJD'), ('FKP', 'FKP'), ('FOK', 'FOK'), ('GBP', 'GBP'), ('GEL', 'GEL'), ('GGP', 'GGP'), ('GHS', 'GHS'), ('GIP', 'GIP'), ('GMD', 'GMD'), ('GNF', 'GNF'), ('GTQ', 'GTQ'), ('GYD', 'GYD'), ('HKD', 'HKD'), ('HNL', 'HNL'), ('HRK', 'HRK'), ('HTG', 'HTG'), ('HUF', 'HUF'), ('IDR', 'IDR'), ('ILS', 'ILS'), ('IMP', 'IMP'), ('INR', 'INR'), ('IQD', 'IQD'), ('IRR', 'IRR'), ('ISK', 'ISK'), ('JEP', 'JEP'), ('JMD', 'JMD'), ('JOD', 'JOD'), ('JPY', 'JPY'), ('KES', 'KES'), ('KGS', 'KGS'), ('KHR', 'KHR'), ('KID', 'KID'), ('KMF', 'KMF'), ('KRW', 'KRW'), ('KWD', 'KWD'), ('KYD', 'KYD'), ('KZT', 'KZT'),
                ('LAK', 'LAK'), ('LBP', 'LBP'), ('LKR', 'LKR'), ('LRD', 'LRD'), ('LSL', 'LSL'), ('LYD', 'LYD'), ('MAD', 'MAD'), ('MDL', 'MDL'), ('MGA', 'MGA'), ('MKD', 'MKD'), ('MMK', 'MMK'), ('MNT', 'MNT'), ('MOP', 'MOP'), ('MRU', 'MRU'), ('MUR', 'MUR'), ('MVR', 'MVR'), ('MWK', 'MWK'), ('MXN', 'MXN'), ('MYR', 'MYR'), ('MZN', 'MZN'), ('NAD', 'NAD'), ('NGN', 'NGN'), ('NIO', 'NIO'), ('NOK', 'NOK'), ('NPR', 'NPR'), ('NZD', 'NZD'), ('OMR', 'OMR'), ('PAB', 'PAB'), ('PEN', 'PEN'), ('PGK', 'PGK'), ('PHP', 'PHP'), ('PKR', 'PKR'), ('PLN', 'PLN'), ('PYG', 'PYG'), ('QAR', 'QAR'), ('RON', 'RON'), ('RSD', 'RSD'), ('RUB', 'RUB'), ('RWF', 'RWF'), ('SAR', 'SAR'), ('SBD', 'SBD'), ('SCR', 'SCR'), ('SDG', 'SDG'), ('SEK', 'SEK'), ('SGD', 'SGD'), ('SHP', 'SHP'), ('SLE', 'SLE'), ('SLL', 'SLL'), ('SOS', 'SOS'), ('SRD', 'SRD'), ('SSP', 'SSP'), ('STN', 'STN'), ('SYP', 'SYP'), ('SZL', 'SZL'), ('THB', 'THB'), ('TJS', 'TJS'), ('TMT', 'TMT'), ('TND', 'TND'), ('TOP', 'TOP'), ('TRY', 'TRY'), ('TTD', 'TTD'), ('TVD', 'TVD'), ('TWD', 'TWD'), ('TZS', 'TZS'), ('UAH', 'UAH'), ('UGX', 'UGX'), ('UYU', 'UYU'), ('UZS', 'UZS'), ('VES', 'VES'), ('VND', 'VND'), ('VUV', 'VUV'), ('WST', 'WST'), ('XAF', 'XAF'), ('XCD', 'XCD'), ('XDR', 'XDR'), ('XOF', 'XOF'), ('XPF', 'XPF'), ('YER', 'YER'), ('ZAR', 'ZAR'), ('ZMW', 'ZMW'), ('ZWL', 'ZWL')]

    STATUS = (('active', 'active'), ('inactive', 'inactive'))
    account_number = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, help_text='user id', related_name='user')
    balance = models.DecimalField(
        default=0, decimal_places=2, max_digits=20, help_text='User account balance')
    account_status = models.CharField(
        max_length=255, choices=STATUS, default='active')
    currency = models.CharField(
        max_length=3, default='XAF', help_text='currency', choices=CURRENCY)
    pin_code = models.CharField(max_length=5, default='00000',
                                help_text='pin code use to manage transaction in a user account')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_agent = models.BooleanField(
        default=False, help_text='determines wether an account is a simple account or an agent account')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Account of {self.user}'

    def set_pincode(self, pincode):
        self.pin_code = pincode
        return self.save()

    def check_pincode(self, pincode):
        # custom account manager created to add verify_pin_code method
        return pincode == self.pin_code


@receiver(post_save, sender=User)
def createAccount(sender, instance, **kwargs):

    if instance.id is not None:
        # it means when the user is created
        Account.objects.create(user=instance)
        Token.objects.create(user=instance)
        p = Profile.objects.filter(user=instance)
        if not p.exists():
            Profile.objects.create(user=instance, dob=datetime.date.today())

# This pre_save signal is use to keep track of the currency meaning that if the currency of a user
#  changes it must be converted from the old one to the new one


@receiver(pre_save, sender=Account)
def checkAccount(sender, instance, **kwargs):

    # If Instance/row is been created,then do nothing
    if instance.id is None:
        pass

    # Else if it is being modified

    else:
        current = instance
        previous = Account.objects.get(id=instance.id)

        # if the previous currency is not equal to the current currency

        if previous.currency != current.currency:
            # convert the account balance to the new currency
            new_balance = converCurrency(
                previous.currency, current.currency, current.balance)
            print('New balance is : ', new_balance)
            current.balance = new_balance

# def account_pre_save(sender,instance,*args,**kwargs):
#     pass


# pre_save.connect(account_pre_save,sender=Account)

# def account_post_save(sender,instance,created,*args,**kwargs):
#     pass


# post_save.connect(account_pre_save,sender=Account)


class TransactionType(models.Model):

    TRANSACTION_TYPE = (
        ('DEPOSIT', 'DESPOSIT'),
        ('TRANSFER', 'TRANSFER'),
        ('WITHDRAW', 'WITHDRAW')
    )

    name = models.CharField(max_length=25, unique=True,
                            choices=TRANSACTION_TYPE, help_text='transaction type name')
    description = models.CharField(
        max_length=255, help_text='transaction type description')

    def __str__(self):
        return f'Transaction Type {self.name}'


class TransactionCharge(models.Model):
    charge = models.FloatField(help_text="charge in % example 0.2 ", default=0)
    type = models.OneToOneField(TransactionType, on_delete=models.CASCADE,
                                related_name='transaction_type', help_text='transaction type id')

    def __str__(self):
        return f'{self.type.name} - Charge {self.charge}'


def generateCode():
    """
    This function is use to generate a transaction code with 8 character
    """
    return binascii.hexlify(os.urandom(4)).decode()


class Transaction(models.Model):

    code = models.CharField(max_length=40, unique=True, editable=False)
    amount = models.DecimalField(
        decimal_places=2, max_digits=20, help_text='the transaction amount')
    currency = models.CharField(
        choices=Account().CURRENCY, max_length=3, blank=True, null=True, editable=False)
    charge = models.ForeignKey(TransactionCharge, on_delete=models.CASCADE,
                               blank=True, editable=False, null=True, help_text='the transaction type id')
    created_at = models.DateTimeField(
        help_text='time at which the transaction was created', auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f'Transaction {self.code} Amount : {self.amount}'

    @classmethod
    def generateCode(cls):
        """
        This function is use to generate a transaction code with 8 character
        """
        return binascii.hexlify(os.urandom(4)).decode()

    def save(self, *args, **kwargs) -> None:
        if not self.code:
            self.code = self.generateCode()
        return super().save(*args, **kwargs)


class Transfer(Transaction):

    sender = models.ForeignKey(Account, on_delete=models.CASCADE,
                               related_name='sender', help_text='the account sender id')
    reciever = models.ForeignKey(Account, on_delete=models.CASCADE,
                                 related_name='reciever', help_text='the reciever account id')


@receiver(pre_save, sender=Transfer)
def checkIfUserCanTransferMoney(sender, instance, **kwargs):

    if instance.id is None:
        sender_account = Account.objects.select_related('user').get(id=instance.sender.id)
        balance = sender_account.balance
        reciever_account = Account.objects.select_related('user').get(id=instance.reciever.id)

        if sender_account.id == reciever_account.id:  
            raise ValidationError(_("You can not send money to you self"))

        amount = float(instance.amount)

        if float(sender_account.balance) >= amount:
            with transaction.atomic():

                if sender_account.is_agent:
                    charge = TransactionType.objects.select_related('transaction_type').filter(
                        name__icontains='deposit').first().transaction_type  
                else:
                    charge = TransactionType.objects.select_related('transaction_type').filter(
                        name__icontains='transfer').first().transaction_type  

                amount_charge = amount*charge.transaction_type.charge
                amount_send = amount - amount_charge

                sender_account.balance = balance - amount_send
                sender_account.save()

                new_amount = converCurrency(
                    sender_account.currency, reciever_account.currency, float(amount_send))

                reciever_account.balance = float(
                    reciever_account.balance)+new_amount
                reciever_account.save()

                instance.currency = sender_account.currency

                instance.charge = charge

        else:
            raise ValidationError(_('The %(value)s balance is insufficent to perform the transaction'), params={
                                  'value': sender_account})


class Withdraw(Transaction):
    withdraw_from = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='withdraw_from',
                                      help_text='the account id of the agent making the transaction', validators=[IsAgent])
    agent = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="agent",
                              help_text='the account id of the user from which the money is withdraw from')


@receiver(pre_save, sender=Withdraw)
def checkIfUserCanWithdrawMoney(sender, instance, **kwargs):

    if instance.id is None:

        withdraw_from = Account.objects.select_related('user').get(id=instance.withdraw_from.id)
        agent = Account.objects.select_related('user').get(id=instance.agent.id)
        balance = withdraw_from.balance

        if withdraw_from.id == agent.id:  
            raise ValidationError(
                _("You can not withdraw money from your self"))

        amount = instance.amount

        if float(withdraw_from.balance) >= float(amount):
            with transaction.atomic():

                charge = TransactionType.objects.select_related('transaction_type').filter(
                    name__icontains='withdraw').first().transaction_type  
                amount_charge = amount*charge.transaction_type.charge
                amount_to_withdraw = amount - amount_charge

                withdraw_from.balance = float(balance) - amount_to_withdraw
                withdraw_from.save()

                agent.balance = float(agent.balance) + amount_to_withdraw
                agent.save()

                instance.currency = withdraw_from.currency

                instance.charge = charge

        else:
            raise ValidationError(_('The %(value)s balance is insufficent to perform the transaction'), params={
                                  'value': withdraw_from})

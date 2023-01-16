from django.db import models
from django.contrib.auth import get_user_model

from .validators import IsAgent, validate_pin_code

from django.core.exceptions import ValidationError

from django.utils.translation import gettext_lazy as _


from django.conf import settings
import uuid
import binascii
import os


User = get_user_model()


# ---------------------------------Models-----------------------------------

class Account(models.Model):

    CURRENCY = [('USD', 'USD'), ('AED', 'AED'), ('AFN', 'AFN'), ('ALL', 'ALL'), ('AMD', 'AMD'), ('ANG', 'ANG'), ('AOA', 'AOA'), ('ARS', 'ARS'), ('AUD', 'AUD'), ('AWG', 'AWG'), ('AZN', 'AZN'), ('BAM', 'BAM'), ('BBD', 'BBD'), ('BDT', 'BDT'), ('BGN', 'BGN'), ('BHD', 'BHD'), ('BIF', 'BIF'), ('BMD', 'BMD'), ('BND', 'BND'), ('BOB', 'BOB'), ('BRL', 'BRL'), ('BSD', 'BSD'), ('BTN', 'BTN'), ('BWP', 'BWP'), ('BYN', 'BYN'), ('BZD', 'BZD'), ('CAD', 'CAD'), ('CDF', 'CDF'), ('CHF', 'CHF'), ('CLP', 'CLP'), ('CNY', 'CNY'), ('COP', 'COP'), ('CRC', 'CRC'), ('CUP', 'CUP'), ('CVE', 'CVE'), ('CZK', 'CZK'), ('DJF', 'DJF'), ('DKK', 'DKK'), ('DOP', 'DOP'), ('DZD', 'DZD'), ('EGP', 'EGP'), ('ERN', 'ERN'), ('ETB', 'ETB'), ('EUR', 'EUR'), ('FJD', 'FJD'), ('FKP', 'FKP'), ('FOK', 'FOK'), ('GBP', 'GBP'), ('GEL', 'GEL'), ('GGP', 'GGP'), ('GHS', 'GHS'), ('GIP', 'GIP'), ('GMD', 'GMD'), ('GNF', 'GNF'), ('GTQ', 'GTQ'), ('GYD', 'GYD'), ('HKD', 'HKD'), ('HNL', 'HNL'), ('HRK', 'HRK'), ('HTG', 'HTG'), ('HUF', 'HUF'), ('IDR', 'IDR'), ('ILS', 'ILS'), ('IMP', 'IMP'), ('INR', 'INR'), ('IQD', 'IQD'), ('IRR', 'IRR'), ('ISK', 'ISK'), ('JEP', 'JEP'), ('JMD', 'JMD'), ('JOD', 'JOD'), ('JPY', 'JPY'), ('KES', 'KES'), ('KGS', 'KGS'), ('KHR', 'KHR'), ('KID', 'KID'), ('KMF', 'KMF'), ('KRW', 'KRW'), ('KWD', 'KWD'), ('KYD', 'KYD'), ('KZT', 'KZT'),
                ('LAK', 'LAK'), ('LBP', 'LBP'), ('LKR', 'LKR'), ('LRD', 'LRD'), ('LSL', 'LSL'), ('LYD', 'LYD'), ('MAD', 'MAD'), ('MDL', 'MDL'), ('MGA', 'MGA'), ('MKD', 'MKD'), ('MMK', 'MMK'), ('MNT', 'MNT'), ('MOP', 'MOP'), ('MRU', 'MRU'), ('MUR', 'MUR'), ('MVR', 'MVR'), ('MWK', 'MWK'), ('MXN', 'MXN'), ('MYR', 'MYR'), ('MZN', 'MZN'), ('NAD', 'NAD'), ('NGN', 'NGN'), ('NIO', 'NIO'), ('NOK', 'NOK'), ('NPR', 'NPR'), ('NZD', 'NZD'), ('OMR', 'OMR'), ('PAB', 'PAB'), ('PEN', 'PEN'), ('PGK', 'PGK'), ('PHP', 'PHP'), ('PKR', 'PKR'), ('PLN', 'PLN'), ('PYG', 'PYG'), ('QAR', 'QAR'), ('RON', 'RON'), ('RSD', 'RSD'), ('RUB', 'RUB'), ('RWF', 'RWF'), ('SAR', 'SAR'), ('SBD', 'SBD'), ('SCR', 'SCR'), ('SDG', 'SDG'), ('SEK', 'SEK'), ('SGD', 'SGD'), ('SHP', 'SHP'), ('SLE', 'SLE'), ('SLL', 'SLL'), ('SOS', 'SOS'), ('SRD', 'SRD'), ('SSP', 'SSP'), ('STN', 'STN'), ('SYP', 'SYP'), ('SZL', 'SZL'), ('THB', 'THB'), ('TJS', 'TJS'), ('TMT', 'TMT'), ('TND', 'TND'), ('TOP', 'TOP'), ('TRY', 'TRY'), ('TTD', 'TTD'), ('TVD', 'TVD'), ('TWD', 'TWD'), ('TZS', 'TZS'), ('UAH', 'UAH'), ('UGX', 'UGX'), ('UYU', 'UYU'), ('UZS', 'UZS'), ('VES', 'VES'), ('VND', 'VND'), ('VUV', 'VUV'), ('WST', 'WST'), ('XAF', 'XAF'), ('XCD', 'XCD'), ('XDR', 'XDR'), ('XOF', 'XOF'), ('XPF', 'XPF'), ('YER', 'YER'), ('ZAR', 'ZAR'), ('ZMW', 'ZMW'), ('ZWL', 'ZWL')]

    STATUS = (('active', 'active'), ('inactive', 'inactive'))
    account_number = models.IntegerField(blank=True,null=True)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, help_text='user id', related_name='account')
    balance = models.FloatField(
        default=0, help_text='User account balance')
    account_status = models.CharField(
        max_length=255, choices=STATUS, default='active')
    currency = models.CharField(
        max_length=3, default='XAF', help_text='currency')
    display_currency = models.CharField(
        max_length=3, default='XAF', choices=CURRENCY)
    pin_code = models.CharField(max_length=5, default=settings.WALLET_DEFAULT_PIN_CODE, validators=[validate_pin_code],
                                help_text='pin code use to authorize transaction in a user account')
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

    def get_balance(self):
        return f"{self.currency} {self.balance}"


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

    @classmethod
    def getTypes(cls):
        return ['DEPOSIT', 'TRANSFER', 'WITHDRAW']


class TransactionCharge(models.Model):
    charge = models.FloatField(
        help_text="charge in % example 0.02 ", default=0)
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
        choices=Account().CURRENCY,default='XAF', max_length=3, blank=True, null=True, editable=False)
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

    TRANSFER_STATE = (
        ('REJECTED', 'REJECTED'),
        ('SUCCESSFULL', 'SUCCESSFULL')
    )

    sender = models.ForeignKey(Account, on_delete=models.CASCADE,
                               related_name='sender', help_text='the account sender id')
    reciever = models.ForeignKey(Account, on_delete=models.CASCADE,
                                 related_name='reciever', help_text='the reciever account id')
    status = models.CharField(
        max_length=20, choices=TRANSFER_STATE, default='SUCCESSFULL')

    def __str__(self):
        return f"Transfer {self.code} {self.status}"

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude)
        if self.sender == self.reciever:
            raise ValidationError(_("You Can't Transfer Money To Your Self"))
        else:
            if self.amount > self.sender.balance:
                raise ValidationError({
                    "sender": _("This account is not able to transfer money because the account balance is insufficient! {} > {}".format(self.amount, self.sender.balance))
                })

    def generateMessage(self, lang: str):
        sender_message = ''
        reciever_message = ''
        if lang == 'FR':
            sender_message = f'Vous avez envoyer un montant de {self.currency} {self.amount} aux compte {self.reciever.account_number} apartenant a {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] a {self.created_at} avec success id de transaction {self.code}.\nVotre nouveaux solde est de {self.currency} {self.sender.balance}'
            reciever_message = f'Vous avez recus un montant de {self.currency} {self.amount} dans votre compte {self.reciever.account_number} de la part de {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] a {self.created_at}.\nVotre nouveaux solde est de {self.currency} {self.reciever.balance}'
        elif lang == 'EN':
            sender_message = f'You have successfully send an amount of {self.currency} {self.amount} to the account number {self.reciever.account_number} belonging to {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] at {self.created_at} transaction id {self.code}.\nYour new account balance is {self.currency} {self.sender.balance}'
            reciever_message = f'You have recieve an amount of {self.currency} {self.amount} in your account {self.reciever.account_number} from {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] at {self.created_at}.\nYour new account balance is {self.currency} {self.reciever.balance}'

        return {'sender_message': sender_message, 'reciever_message': reciever_message}

    class Meta:
        ordering = ['-created_at']


class Withdraw(Transaction):

    # state here represents the different state of withdraw wich can either be 'pending','cancel','accepted'

    WITHDRAW_STATE = (
        ('PENDING', 'PENDING'),
        ('REJECTED', 'REJECTED'),
        ('CANCEL', 'CANCEL'),
        ('ACCEPTED', 'ACCEPTED')
    )

    withdraw_from = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='withdraw_from',
                                      help_text='the account id of the agent making the transaction')
    agent = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="agent",
                              help_text='the account id of the user from which the money is withdraw from', validators=[IsAgent])

    state = models.CharField(max_length=20, choices=WITHDRAW_STATE, default='PENDING',
                             help_text="state here represents the different state of withdraw wich can either be 'pending','cancel','accepted','rejected'")

    charge = models.ForeignKey(TransactionCharge, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.code} {self.state}'

    def clean_fields(self, exclude=None) -> None:
        super().clean_fields(exclude)

        if self.withdraw_from == self.agent:
            raise ValidationError(_("You Can't Withdraw Money From Your self"))

        else:
            if self.amount > self.withdraw_from.balance:
                raise ValidationError({'withdraw_from': _(
                    "You can't withdraw money from the account the account balance is insufficent")})

    class Meta:
        ordering = ['-created_at']


class Deposit(Transaction):

    DEPOSIT_STATE = (
        ('REJECTED', 'REJECTED'),
        ('SUCCESSFULL', 'SUCCESSFULL')
    )

    sender = models.ForeignKey(Account, on_delete=models.CASCADE,
                               related_name='sender_account', help_text='the account sender id')
    reciever = models.ForeignKey(Account, on_delete=models.CASCADE,
                                 related_name='reciever_account', help_text='the reciever account id')
    status = models.CharField(
        max_length=20, choices=DEPOSIT_STATE, default='SUCCESSFULL')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Deposit {self.code} {self.status}"

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude)
        if self.sender == self.reciever:
            raise ValidationError(_("You Can't Deposit Money To Your Self"))
        else:
            if self.amount > self.sender.balance:
                raise ValidationError({
                    "sender": _("This account is not able to deposit money because the account balance is insufficient! {} > {}".format(self.amount, self.sender.balance))
                })

    def generateMessage(self, lang: str):
        sender_message = ''
        reciever_message = ''
        if lang == 'FR':
            sender_message = f'Vous avez fait un depot de {self.currency} {self.amount} aux compte {self.reciever.account_number} de {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] a {self.created_at} avec success id de transaction {self.code}.\nVotre nouveaux solde est de {self.currency} {self.sender.balance}'
            reciever_message = f'Vous avez recus un depot de {self.currency} {self.amount} dans votre compte {self.reciever.account_number} de la part de {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] a {self.created_at}.\nVotre nouveaux solde est de {self.currency} {self.reciever.balance}'
        elif lang == 'EN':
            sender_message = f'You have successfully make a deposit  of {self.currency} {self.amount} to the account number {self.reciever.account_number} of {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] at {self.created_at} transaction id {self.code}.\nYour new account balance is {self.currency} {self.sender.balance}'
            reciever_message = f'You have recieve a deposit of {self.currency} {self.amount} in your account {self.reciever.account_number} from {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] at {self.created_at}.\nYour new account balance is {self.currency} {self.reciever.balance}'

        return {'sender_message': sender_message, 'reciever_message': reciever_message}

from django.db import models
from django.contrib.auth import get_user_model

import uuid

User = get_user_model()


class Account(models.Model):

    CURRENCY = [('USD', 'USD'), ('AED', 'AED'), ('AFN', 'AFN'), ('ALL', 'ALL'), ('AMD', 'AMD'), ('ANG', 'ANG'), ('AOA', 'AOA'), ('ARS', 'ARS'), ('AUD', 'AUD'), ('AWG', 'AWG'), ('AZN', 'AZN'), ('BAM', 'BAM'), ('BBD', 'BBD'), ('BDT', 'BDT'), ('BGN', 'BGN'), ('BHD', 'BHD'), ('BIF', 'BIF'), ('BMD', 'BMD'), ('BND', 'BND'), ('BOB', 'BOB'), ('BRL', 'BRL'), ('BSD', 'BSD'), ('BTN', 'BTN'), ('BWP', 'BWP'), ('BYN', 'BYN'), ('BZD', 'BZD'), ('CAD', 'CAD'), ('CDF', 'CDF'), ('CHF', 'CHF'), ('CLP', 'CLP'), ('CNY', 'CNY'), ('COP', 'COP'), ('CRC', 'CRC'), ('CUP', 'CUP'), ('CVE', 'CVE'), ('CZK', 'CZK'), ('DJF', 'DJF'), ('DKK', 'DKK'), ('DOP', 'DOP'), ('DZD', 'DZD'), ('EGP', 'EGP'), ('ERN', 'ERN'), ('ETB', 'ETB'), ('EUR', 'EUR'), ('FJD', 'FJD'), ('FKP', 'FKP'), ('FOK', 'FOK'), ('GBP', 'GBP'), ('GEL', 'GEL'), ('GGP', 'GGP'), ('GHS', 'GHS'), ('GIP', 'GIP'), ('GMD', 'GMD'), ('GNF', 'GNF'), ('GTQ', 'GTQ'), ('GYD', 'GYD'), ('HKD', 'HKD'), ('HNL', 'HNL'), ('HRK', 'HRK'), ('HTG', 'HTG'), ('HUF', 'HUF'), ('IDR', 'IDR'), ('ILS', 'ILS'), ('IMP', 'IMP'), ('INR', 'INR'), ('IQD', 'IQD'), ('IRR', 'IRR'), ('ISK', 'ISK'), ('JEP', 'JEP'), ('JMD', 'JMD'), ('JOD', 'JOD'), ('JPY', 'JPY'), ('KES', 'KES'), ('KGS', 'KGS'), ('KHR', 'KHR'), ('KID', 'KID'), ('KMF', 'KMF'), ('KRW', 'KRW'), ('KWD', 'KWD'), ('KYD', 'KYD'), ('KZT', 'KZT'), ('LAK', 'LAK'), ('LBP', 'LBP'), ('LKR', 'LKR'), ('LRD', 'LRD'), ('LSL', 'LSL'), ('LYD', 'LYD'), ('MAD', 'MAD'), ('MDL', 'MDL'), ('MGA', 'MGA'), ('MKD', 'MKD'), ('MMK', 'MMK'), ('MNT', 'MNT'), ('MOP', 'MOP'), ('MRU', 'MRU'), ('MUR', 'MUR'), ('MVR', 'MVR'), ('MWK', 'MWK'), ('MXN', 'MXN'), ('MYR', 'MYR'), ('MZN', 'MZN'), ('NAD', 'NAD'), ('NGN', 'NGN'), ('NIO', 'NIO'), ('NOK', 'NOK'), ('NPR', 'NPR'), ('NZD', 'NZD'), ('OMR', 'OMR'), ('PAB', 'PAB'), ('PEN', 'PEN'), ('PGK', 'PGK'), ('PHP', 'PHP'), ('PKR', 'PKR'), ('PLN', 'PLN'), ('PYG', 'PYG'), ('QAR', 'QAR'), ('RON', 'RON'), ('RSD', 'RSD'), ('RUB', 'RUB'), ('RWF', 'RWF'), ('SAR', 'SAR'), ('SBD', 'SBD'), ('SCR', 'SCR'), ('SDG', 'SDG'), ('SEK', 'SEK'), ('SGD', 'SGD'), ('SHP', 'SHP'), ('SLE', 'SLE'), ('SLL', 'SLL'), ('SOS', 'SOS'), ('SRD', 'SRD'), ('SSP', 'SSP'), ('STN', 'STN'), ('SYP', 'SYP'), ('SZL', 'SZL'), ('THB', 'THB'), ('TJS', 'TJS'), ('TMT', 'TMT'), ('TND', 'TND'), ('TOP', 'TOP'), ('TRY', 'TRY'), ('TTD', 'TTD'), ('TVD', 'TVD'), ('TWD', 'TWD'), ('TZS', 'TZS'), ('UAH', 'UAH'), ('UGX', 'UGX'), ('UYU', 'UYU'), ('UZS', 'UZS'), ('VES', 'VES'), ('VND', 'VND'), ('VUV', 'VUV'), ('WST', 'WST'), ('XAF', 'XAF'), ('XCD', 'XCD'), ('XDR', 'XDR'), ('XOF', 'XOF'), ('XPF', 'XPF'), ('YER', 'YER'), ('ZAR', 'ZAR'), ('ZMW', 'ZMW'), ('ZWL', 'ZWL')]

    STATUS = (('active','active'),('inactive','inactive'))
    account_number = models.UUIDField(default=uuid.uuid4,unique=True,editable=False)
    user = models.OneToOneField(User,on_delete=models.CASCADE,help_text='user id')
    balance = models.BigIntegerField(default=0,help_text='User account balance')
    account_status = models.CharField(max_length=255,choices=STATUS,default='active')
    currency = models.CharField(max_length=3,default='XAF',help_text='currency',choices=CURRENCY)
    pin_code = models.CharField(max_length=5,default='00000',help_text='pin code use to manage transaction in a user account')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_agent = models.BooleanField(default=False,help_text='determines wether an account is a simple account or an agent account')

    class Meta:
        ordering = ['-balance']

    def __str__(self):
        return f'Account of {self.user}'


class TransactionType(models.Model):

    TRANSACTION_TYPE = (
        ('DEPOSIT','WITHDRAW'),
        ('TRANSFER','TRANSFER'),
        ('WITHDRAW','WITHDRAW')
    )

    name = models.CharField(max_length=25,unique=True,choices=TRANSACTION_TYPE,help_text='transaction type name')
    description = models.CharField(max_length=255,help_text='transaction type description')

    def __str__(self):
        return f'Transaction Type {self.name}'
        
class TransactionCharge(models.Model):
    charge = models.FloatField(help_text="charge in % example 0.2 ")
    type = models.ForeignKey(TransactionType,on_delete=models.CASCADE,related_name='transaction_type',help_text='transaction type id')

    def __str__(self):
        return f'{self.charge}'

class Transaction(models.Model):
    code = models.UUIDField(default=uuid.uuid4,unique=True,editable=False)
    amount = models.FloatField(help_text='the transaction amount')
    created_at = models.DateTimeField(help_text='time at which the transaction was created')
    
    class Meta:
        abstract = True

    def __str__(self):
        return f'Transaction {self.code} Amount : {self.amount}'

class Transfer(Transaction):
    
    sender = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='sender',help_text='the account sender id')
    reciever = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='reciever',help_text='the reciever account id')
    charge = models.ForeignKey(TransactionCharge,on_delete=models.CASCADE,related_name='transaction_charge',help_text='the transaction type id')


class Withdraw(Transaction):
    withdraw_from = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='withdraw_from',help_text='the account id of the agent making the transaction')
    agent = models.ForeignKey(Account,on_delete=models.CASCADE,related_name="agent",help_text='the account id of the user from which the money is withdraw from')
    withdraw_charge = models.ForeignKey(TransactionCharge,on_delete=models.CASCADE,related_name='withdraw_charge',help_text='the transaction charge id')


class Deposit(Transaction):
    deposit_from = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='deposit_from',help_text='the account id which is depositing the money')
    deposit_to = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='deposit_to',help_text='the account id which is recieving the money')
    
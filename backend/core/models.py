from django.db import models
from django.db.models.signals import pre_save, post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from core.api.utils import converCurrency
from .validators import IsAgent

from django.conf import settings

from django.utils.translation import gettext_lazy as _

from django.db import transaction

import uuid
import binascii
import os
import datetime

from accounts.models import Profile
from rest_framework.authtoken.models import Token
from notifications.models import Notification

from notifications import status as notification_status

User = get_user_model()


class Account(models.Model):

    CURRENCY = [('USD', 'USD'), ('AED', 'AED'), ('AFN', 'AFN'), ('ALL', 'ALL'), ('AMD', 'AMD'), ('ANG', 'ANG'), ('AOA', 'AOA'), ('ARS', 'ARS'), ('AUD', 'AUD'), ('AWG', 'AWG'), ('AZN', 'AZN'), ('BAM', 'BAM'), ('BBD', 'BBD'), ('BDT', 'BDT'), ('BGN', 'BGN'), ('BHD', 'BHD'), ('BIF', 'BIF'), ('BMD', 'BMD'), ('BND', 'BND'), ('BOB', 'BOB'), ('BRL', 'BRL'), ('BSD', 'BSD'), ('BTN', 'BTN'), ('BWP', 'BWP'), ('BYN', 'BYN'), ('BZD', 'BZD'), ('CAD', 'CAD'), ('CDF', 'CDF'), ('CHF', 'CHF'), ('CLP', 'CLP'), ('CNY', 'CNY'), ('COP', 'COP'), ('CRC', 'CRC'), ('CUP', 'CUP'), ('CVE', 'CVE'), ('CZK', 'CZK'), ('DJF', 'DJF'), ('DKK', 'DKK'), ('DOP', 'DOP'), ('DZD', 'DZD'), ('EGP', 'EGP'), ('ERN', 'ERN'), ('ETB', 'ETB'), ('EUR', 'EUR'), ('FJD', 'FJD'), ('FKP', 'FKP'), ('FOK', 'FOK'), ('GBP', 'GBP'), ('GEL', 'GEL'), ('GGP', 'GGP'), ('GHS', 'GHS'), ('GIP', 'GIP'), ('GMD', 'GMD'), ('GNF', 'GNF'), ('GTQ', 'GTQ'), ('GYD', 'GYD'), ('HKD', 'HKD'), ('HNL', 'HNL'), ('HRK', 'HRK'), ('HTG', 'HTG'), ('HUF', 'HUF'), ('IDR', 'IDR'), ('ILS', 'ILS'), ('IMP', 'IMP'), ('INR', 'INR'), ('IQD', 'IQD'), ('IRR', 'IRR'), ('ISK', 'ISK'), ('JEP', 'JEP'), ('JMD', 'JMD'), ('JOD', 'JOD'), ('JPY', 'JPY'), ('KES', 'KES'), ('KGS', 'KGS'), ('KHR', 'KHR'), ('KID', 'KID'), ('KMF', 'KMF'), ('KRW', 'KRW'), ('KWD', 'KWD'), ('KYD', 'KYD'), ('KZT', 'KZT'),
                ('LAK', 'LAK'), ('LBP', 'LBP'), ('LKR', 'LKR'), ('LRD', 'LRD'), ('LSL', 'LSL'), ('LYD', 'LYD'), ('MAD', 'MAD'), ('MDL', 'MDL'), ('MGA', 'MGA'), ('MKD', 'MKD'), ('MMK', 'MMK'), ('MNT', 'MNT'), ('MOP', 'MOP'), ('MRU', 'MRU'), ('MUR', 'MUR'), ('MVR', 'MVR'), ('MWK', 'MWK'), ('MXN', 'MXN'), ('MYR', 'MYR'), ('MZN', 'MZN'), ('NAD', 'NAD'), ('NGN', 'NGN'), ('NIO', 'NIO'), ('NOK', 'NOK'), ('NPR', 'NPR'), ('NZD', 'NZD'), ('OMR', 'OMR'), ('PAB', 'PAB'), ('PEN', 'PEN'), ('PGK', 'PGK'), ('PHP', 'PHP'), ('PKR', 'PKR'), ('PLN', 'PLN'), ('PYG', 'PYG'), ('QAR', 'QAR'), ('RON', 'RON'), ('RSD', 'RSD'), ('RUB', 'RUB'), ('RWF', 'RWF'), ('SAR', 'SAR'), ('SBD', 'SBD'), ('SCR', 'SCR'), ('SDG', 'SDG'), ('SEK', 'SEK'), ('SGD', 'SGD'), ('SHP', 'SHP'), ('SLE', 'SLE'), ('SLL', 'SLL'), ('SOS', 'SOS'), ('SRD', 'SRD'), ('SSP', 'SSP'), ('STN', 'STN'), ('SYP', 'SYP'), ('SZL', 'SZL'), ('THB', 'THB'), ('TJS', 'TJS'), ('TMT', 'TMT'), ('TND', 'TND'), ('TOP', 'TOP'), ('TRY', 'TRY'), ('TTD', 'TTD'), ('TVD', 'TVD'), ('TWD', 'TWD'), ('TZS', 'TZS'), ('UAH', 'UAH'), ('UGX', 'UGX'), ('UYU', 'UYU'), ('UZS', 'UZS'), ('VES', 'VES'), ('VND', 'VND'), ('VUV', 'VUV'), ('WST', 'WST'), ('XAF', 'XAF'), ('XCD', 'XCD'), ('XDR', 'XDR'), ('XOF', 'XOF'), ('XPF', 'XPF'), ('YER', 'YER'), ('ZAR', 'ZAR'), ('ZMW', 'ZMW'), ('ZWL', 'ZWL')]

    STATUS = (('active', 'active'), ('inactive', 'inactive'))
    account_number = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, help_text='user id', related_name='account')
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

    def get_balance(self):
        return f"{self.currency} {self.balance}"


@receiver(post_save, sender=User)
def createAccount(sender, instance, **kwargs):

    if instance.id is not None:
        # it means when the user is created
        if not Account.objects.select_related('user').filter(user=instance).exists():
            Account.objects.create(user=instance)
        if not Token.objects.filter(user=instance).exists():
            Token.objects.create(user=instance)
        p = Profile.objects.select_related('user').filter(user=instance)
        if not p.exists():
            Profile.objects.create(user=instance, dob=datetime.date.today())
        else:
            profile = p.first()

            lang = profile.lang
            msg = ''

            if lang == 'FR':
                msg = f'Bienvenu sur {settings.APP_NAME}\nVotre code pin est [00000] et solde de votre compte est {profile.user.account.currency} {profile.user.account.balance}'
            elif lang == 'EN':
                msg = f'Welcome To {settings.APP_NAME} \nYour pin code is [00000] and account balance is {profile.user.account.currency} {profile.user.account.balance}'
            
            Notification.objects.create(user=profile.user,message=msg)

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

            lang = instance.user.profile.lang

            if lang == 'FR':
                msg = f'La monnaie de votre compte a ete changer de {previous.currency} a {instance.currency} Solde : {instance.currency} {instance.balance}'
            else:
                msg = f'The currency of your account have been changed from {previous.currency} to {instance.currency} New balance : {instance.currency} {instance.balance}'
            
            Notification.objects.create(user=instance.user,message=msg)

        if instance.balance != previous.balance and instance.currency == previous.currency:
            lang = instance.user.profile.lang
            msg = ''
            if lang == 'FR':
                msg = f'Votre complte a ete crediter de {instance.currency} {instance.balance}'
            else:
                msg = f'Your account has been fill with {instance.currency} {instance.balance}'
            
            Notification.objects.create(user=instance.user,message=msg)
        


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
        return ['DEPOSIT','TRANSFER','WITHDRAW']


class TransactionCharge(models.Model):
    charge = models.FloatField(help_text="charge in % example 0.02 ", default=0)
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

    def generateMessage(self, lang: str):
        sender_message = ''
        reciever_message = ''
        if lang == 'FR':
            sender_message = f'Vous avez envoyer un montant de {self.currency} {self.amount} aux compte {self.reciever.account_number} apartenant a {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] a {self.created_at} avec success id de transaction {self.code}.\nVotre nouveaux solde est de {self.currency} {self.sender.balance}'
            reciever_message = f'Vous avez recus un montant de {self.currency} {self.amount} dans votre compte {self.reciever.account_number} de la part de {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] a {self.created_at}.\nVotre nouveaux solde est de {self.currency} {self.reciever.balance}'
        elif lang == 'EN':
            sender_message = f'You have successfully send an amount of {self.currency} {self.amount} to the account number {self.reciever.account_number} belonging to {self.reciever.user.first_name} {self.reciever.user.last_name} [{self.reciever.user}] at {self.created_at} transaction id {self.code}.\nYour new account balance is {self.currency} {self.sender.balance}'
            reciever_message = f'You have recieve an amount of {self.currency} {self.amount} dans votre compte {self.reciever.account_number} from {self.sender.user.first_name} {self.sender.user.last_name} [{self.sender.user}] at {self.created_at}.\nYour new account balance is {self.currency} {self.reciever.balance}'

        return {'sender_message': sender_message, 'reciever_message': reciever_message}


@receiver(pre_save, sender=Transfer)
def checkIfUserCanTransferMoney(sender, instance, **kwargs):

    if instance.id is None:
        sender_account = Account.objects.select_related(
            'user').get(id=instance.sender.id)
        balance = sender_account.balance
        reciever_account = Account.objects.select_related(
            'user').get(id=instance.reciever.id)

        amount = float(instance.amount)

        if sender_account.id == reciever_account.id:
            msg = ''
            if sender_account.user.profile.lang == 'FR':
                msg = 'Desoler ! vous ne pouvez pas vous envoyer de l\'argent!'
            elif sender_account.user.profile.lang == 'EN':
                msg = 'Sorry ! You can\'t send mney to your self!'

            Notification.objects.create(
                user=sender_account.user, message=msg, type=notification_status.NOTIFICATION_ALERT)
            Notification.objects.create(
                user=sender_account.user, message='Transfer could not be achieve successfully!', type="TRANSFER_REJECTED")

            instance.status = 'REJECTED'

            # raise ValidationError(_("You can not send money to you self"))

        else:

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
                instance.status = 'REJECTED'
                Notification.objects.create(user=sender_account.user, message="Your account balance is insufficent to perform the transaction. Please fill you account and retry later!\nCurrent account balance {}".format(
                    sender_account.get_balance()), type="TRANSFER_REJECTED")
                # raise ValidationError(_('The %(value)s balance is insufficent to perform the transaction'), params={
                #                       'value': sender_account})


@receiver(post_save, sender=Transfer)
def sendNotificationsToAccounst(sender, instance, created, **kwargs):

    if created:
        if instance.state == 'SUCCESSFULL':
            Notification.objects.create(user=instance.sender, message=instance.sender.generateMessage(
                instance.sender.user.profile.lang)["sender_message"], type=notification_status.NOTIFICATION_TRANSFER_SUCCESSFULL)

            Notification.objects.create(user=instance.reciever, message=instance.sender.generateMessage(
                instance.srecieverender.user.profile.lang)["reciever_message"], type=notification_status.NOTIFICATION_NORMAL)


class Withdraw(Transaction):

    # state here represents the different state of withdraw wich can either be 'pending','cancel','accepted'

    WITHDRAW_STATE = (
        ('PENDING', 'PENDING'),
        ('REJECTED', 'REJECTED'),
        ('CANCEL', 'CANCEL'),
        ('ACCEPTED', 'ACCEPTED')
    )

    withdraw_from = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='withdraw_from',
                                      help_text='the account id of the agent making the transaction', validators=[IsAgent])
    agent = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="agent",
                              help_text='the account id of the user from which the money is withdraw from')

    state = models.CharField(max_length=20, choices=WITHDRAW_STATE, default='PENDING',
                             help_text="state here represents the different state of withdraw wich can either be 'pending','cancel','accepted','rejected'")


@receiver(pre_save, sender=Withdraw)
def checkIfUserCanWithdrawMoney(sender, instance, **kwargs):

    if instance.id is not None:

        withdraw_from = Account.objects.select_related(
            'user').get(id=instance.withdraw_from.id)
        agent = Account.objects.select_related(
            'user').get(id=instance.agent.id)
        balance = withdraw_from.balance

        amount = instance.amount

        if instance.state == 'CANCEL':

            sender_msg = ''
            receiver_msg = ''

            lang = withdraw_from.user.profile.lang
            lang1 = agent.user.profile.lang

            if lang == 'EN':
                sender_msg = f'The withdrawal of {instance.currency} {instance.amount} from your account {withdraw_from.account_number} by {agent.user.first_name} {agent.user.last_name} [{agent.user}] has been cancel'
            elif lang == 'FR':
                sender_msg = f'La demande de retrait de {instance.currency} {instance.amount} de votre compte {agent.account_number} par {agent.user.first_name} {agent.user.last_name} [{agent.user}] a ete annulez'

            if lang1 == 'EN':
                receiver_msg = f'The withdrawal of {instance.currency} {instance.amount} from the account {withdraw_from.account_number} {withdraw_from.user.first_name} {withdraw_from.user.last_name} [{withdraw_from.user}] has been cancel'
            elif lang1 == 'FR':
                receiver_msg = f'Le retrait de  {instance.currency} {instance.amount} du compte {withdraw_from.account_number} {withdraw_from.user.first_name} {withdraw_from.user.last_name} [{withdraw_from.user}] a ete annulez'

            Notification.objects.create(
                user=instance.withdraw_from.user,
                msg=sender_msg,
                type=notification_status.NOTIFICATION_WITHDRAW_CANCEL
            )

            Notification.objects.create(
                user=instance.agent.user,
                msg=receiver_msg,
                type=notification_status.NOTIFICATION_WITHDRAW_CANCEL
            )

        elif instance.state == 'ACCEPTED':

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
                instance.status = 'REJECTED'

                Notification.objects.create(user=withdraw_from.user, message="Your account balance is insufficent to perform the transaction. Please fill you account and retry later!\nCurrent account balance {}".format(
                    withdraw_from.get_balance()), type=notification_status.NOTIFCATION_WITHDRAW_REJECTED)

    if instance.id is None:

        withdraw_from = Account.objects.select_related(
            'user').get(id=instance.withdraw_from.id)
        agent = Account.objects.select_related(
            'user').get(id=instance.agent.id)
        balance = withdraw_from.balance

        amount = instance.amount

        if withdraw_from.id == agent.id:
            # raise ValidationError(
            #     _("You can not withdraw money from your self"))
            msg = ''
            if agent.user.profile.lang == 'FR':
                msg = 'Desoler ! vous ne pouvez pas vous retirez de l\'argent!'
            elif agent.user.profile.lang == 'EN':
                msg = 'Sorry ! You can\'t withdraw money from your self!'
            Notification.objects.create(
                user=agent.user, message=msg, type=notification_status.NOTIFICATION_ALERT)
        else:

            if float(withdraw_from.balance) >= float(amount):
            
                charge = TransactionType.objects.select_related('transaction_type').filter(
                    name__icontains='withdraw').first().transaction_type

                instance.currency = withdraw_from.currency

                instance.charge = charge

            else:
                
                instance.status = 'REJECTED'

                Notification.objects.create(user=withdraw_from.user, message="Your account balance is insufficent to perform the transaction. Please fill you account and retry later!\nCurrent account balance {}".format(
                    withdraw_from.get_balance()), type=notification_status.NOTIFCATION_WITHDRAW_REJECTED)

                # raise ValidationError(_('The %(value)s balance is insufficent to perform the transaction'), params={
                #                     'value': withdraw_from})


@receiver(post_save, sender=Withdraw)
def concludeWithdraw(sender, instance, created, **kwargs):
    pass

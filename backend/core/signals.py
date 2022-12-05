from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from django.db import transaction


from .models import Account,Transfer,Withdraw,TransactionType
from notifications.models import Notification
from accounts.models import Profile

from django.utils.translation import gettext_lazy as _
from django.conf import settings

import datetime

from core.api.utils import converCurrency
from notifications import status as notification_status

User = get_user_model()


# --------------------------------Django SIgnals------------------------------------------

@receiver(post_save, sender=User)
def createAccount(sender, instance,created, **kwargs):

    if created:
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

            Notification.objects.create(user=profile.user, message=msg)


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

            Notification.objects.create(user=instance.user, message=msg)

        # if instance.balance != previous.balance and instance.currency == previous.currency:
        #     lang = instance.user.profile.lang
        #     msg = ''
        #     if lang == 'FR':
        #         msg = f'Votre complte a ete crediter de {instance.currency} {instance.balance}'
        #     else:
        #         msg = f'Your account has been fill with {instance.currency} {instance.balance}'

        #     Notification.objects.create(user=instance.user, message=msg)


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

                    amount_charge = amount*charge.charge
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
        if instance.status == 'SUCCESSFULL':
            Notification.objects.create(user=instance.sender.user, message=instance.generateMessage(
                instance.sender.user.profile.lang)["sender_message"], type=notification_status.NOTIFICATION_TRANSFER_SUCCESSFULL)

            Notification.objects.create(user=instance.reciever.user, message=instance.generateMessage(
                instance.reciever.user.profile.lang)["reciever_message"], type=notification_status.NOTIFICATION_NORMAL)


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
                    amount_charge = float(amount)*float(charge.charge)
                    amount_to_withdraw = float(amount) - float(amount_charge)

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

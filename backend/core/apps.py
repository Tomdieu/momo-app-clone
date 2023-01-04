from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_transaction_charges_after_migrations(sender,**kwargs):
    """
        This function create the transaction charges and transaction type after
        the app has been migrated
    """
    from .models import TransactionType,TransactionCharge
    # from django.core.management.base import BaseCommand
    # from datetime import datetime
    # cmd = BaseCommand()
    for t_type in TransactionType.getTypes():
            T = TransactionType.objects.filter(name=t_type)

            if not T.exists():
                transaction_type = TransactionType.objects.create(name=t_type,description=f'Transaction type {t_type}')
                # cmd.stdout.write(f"[{now}] "+cmd.style.SUCCESS("'%s' "% transaction_type)+" Successfully created ")

                if t_type != 'DEPOSIT':
                    charge = TransactionCharge.objects.create(charge=0.02,type=transaction_type)
                else:
                    charge = TransactionCharge.objects.create(charge=0.0,type=transaction_type)
                
                # cmd.stdout.write("Transaction charge of "+cmd.style.SUCCESS("'%s' "% t_type)+" Successfully created with charges of " + cmd.style.SUCCESS(r"{}%".format(int(charge.charge*100))))
            # else:
            #     cmd.stdout.write(f"[{now}] "+cmd.style.SUCCESS("'%s'"% t_type)+' Transaction Type Already exists! ')

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self) -> None:
        import core.signals
        post_migrate.connect(create_transaction_charges_after_migrations,self)
        
from django.core.management.base import BaseCommand, CommandError
from core.models import TransactionCharge,TransactionType
from datetime import datetime


class Command(BaseCommand):
    help = 'This commands helps to create the different transaction charges'


    def handle(self, *args, **options):
        for t_type in TransactionType.getTypes():
            T = TransactionType.objects.filter(name=t_type)
            now = datetime.now()
            if not T.exists():
                transaction_type = TransactionType.objects.create(name=t_type,description=f'Transaction type {t_type}')
                
                self.stdout.write(f"[{now}] "+self.style.SUCCESS("'%s' "% transaction_type)+" Successfully created ")

                if t_type != 'DEPOSIT':
                    charge = TransactionCharge.objects.create(charge=0.02,type=transaction_type)
                else:
                    charge = TransactionCharge.objects.create(charge=0.0,type=transaction_type)
                
                self.stdout.write("Transaction charge of "+self.style.SUCCESS("'%s' "% t_type)+" Successfully created with charges of " + self.style.SUCCESS(r"{}%".format(int(charge.charge*100))))
            else:
                self.stdout.write(f"[{now}] "+self.style.SUCCESS("'%s'"% t_type)+' Transaction Type Already exists! ')
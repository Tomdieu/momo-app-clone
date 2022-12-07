from __future__ import absolute_import,unicode_literals

from celery import shared_task


@shared_task
def cancel_withdrawal_with_pending_state_greater_than_2_minute():

    from core.models import Withdraw
    from django.db.models import Q
    from datetime import datetime,timedelta
    from django.conf import settings

    

    n = settings.WITHDRAW_MONEY_MINUTES
    td = timedelta
    now = datetime.now()

    queryset = Withdraw.objects.filter(
            Q(state='PENDING') &
            Q(created_at__lte=now) &
            Q(created_at__lt=now-td(minutes=n))
        ).order_by('-created_at')

    print(f'\n[{datetime.now()}] pass througth {len(queryset)} withdrawals\n')


    queryset.update(state='CANCEL')



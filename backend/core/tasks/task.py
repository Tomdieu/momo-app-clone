from __future__ import absolute_import,unicode_literals

from celery import shared_task


@shared_task
def cancel_withdrawal_with_pending_state_greater_than_2_minute():

    from core.models import Withdraw
    from django.db.models import Q
    from django.conf import settings

    from django.utils import timezone
    

    m = settings.WITHDRAW_MONEY_MINUTES
    td = timezone.timedelta
    now = timezone.now()

    queryset = Withdraw.objects.filter(
            Q(state='PENDING') &
            Q(created_at__lte=now) &
            Q(created_at__lt=now-td(minutes=m))
        ).order_by('-created_at')

    if(len(queryset) > 0):
        print(f'\n[{timezone.now()}] pass througth {len(queryset)} withdrawals\n')


    queryset.update(state='CANCEL')



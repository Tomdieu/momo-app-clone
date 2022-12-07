import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app=Celery("backend")

app.config_from_object('django.conf:settings', namespace='CELERY')


app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# app.conf.beat_schedule={
#     'every_10_minutes':{
#         'task':'scrape_hacker_new_rss_feed',
#         'schedule': crontab()
        
#     }
# }
from django.contrib import admin

from .models import Notification

# Register your models here.

class NotificationAdmin(admin.ModelAdmin):

    list_display = ('user','message','created_at')
    search_fields = ('user__username','message')


admin.site.register(Notification,NotificationAdmin)

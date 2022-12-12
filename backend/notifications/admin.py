from django.contrib import admin

from .models import Notification

# Register your models here.

class NotificationAdmin(admin.ModelAdmin):

    list_display = ('id','user','message','created_at')
    search_fields = ('user__username','message')
    list_per_page = 25


admin.site.register(Notification,NotificationAdmin)

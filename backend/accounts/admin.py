from django.contrib import admin

# Register your models here.

from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import Profile

User = get_user_model()

class ProfileAdmin(admin.ModelAdmin):

	list_display = ('user','phone_number','dob','city','created_at')
	search_fields=('user','city','phone_number')
	list_filter = ('user','city','dob')

admin.site.register(Profile,ProfileAdmin)
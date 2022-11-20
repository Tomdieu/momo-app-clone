from django.contrib import admin
import datetime

# Register your models here.

from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Profile

User = get_user_model()


class ProfileAdmin(admin.ModelAdmin):

	list_display = ('user','phone_number','age','city','created_at','updated_at')
	search_fields=('user__username','city','phone_number')
	list_filter = ('user','city','dob')
	list_per_page = 25


	@admin.display
	def age(self,obj):
		return datetime.date.today().year - int(obj.dob.year) 

admin.site.register(Profile,ProfileAdmin)
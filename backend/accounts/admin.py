from django.contrib import admin
import datetime

# Register your models here.

from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Profile

User = get_user_model()


class ProfileAdmin(admin.ModelAdmin):

	list_display = ('user','phone_number','age','city','lang','created_at','updated_at')
	search_fields=('user__username','city','phone_number')
	list_filter = ('user','city','dob','lang')
	list_per_page = 25

	actions = ['reset_password']


	@admin.display
	def age(self,obj):
		if obj.dob:
			a = datetime.date.today().year - int(obj.dob.year)
			return f'{a} yrs'
		return None

	@admin.action(description='Reset password to 1234')
	def reset_password(self,queryset):
		for profile in queryset:
			profile.user.set_password('1234')

admin.site.register(Profile,ProfileAdmin)
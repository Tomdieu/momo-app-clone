from django.forms import ModelForm
from django import forms
from .models import Profile

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from django.contrib.auth import get_user_model

import datetime

User = get_user_model()

class UserForm(ModelForm):
    
    confirm_password = forms.CharField(max_length=120,widget=forms.PasswordInput)
    password = forms.CharField(max_length=120,widget=forms.PasswordInput)
    last_name = forms.CharField(max_length=120,help_text=_("Last name optional"),required=False)
    first_name = forms.CharField(max_length=120,help_text=_('First name require'))
    
    class Meta:

        model = User
        fields = ['username','first_name','last_name','email','password','confirm_password']
        required_fields = ['first_name']
    
    def clean_email(self):
        email = self.cleaned_data.get('email')

        if not email:
            raise ValidationError(_('email required!'))

    # def clean_first_name(self):

    #     first_name = self.cleaned_data.get('first_name')

    #     if not first_name:
    #         raise ValidationError(_('first name required'))

    #     return first_name

    def clean_confirm_password(self):
        confirm_password = self.cleaned_data.get('confirm_password')
        password= self.cleaned_data.get('password')
        if confirm_password != password:
            raise ValidationError( _('The confirm password is different from the password'))

        else:
            return confirm_password

    def clean_password(self):

        password = self.cleaned_data.get('password')

        if len(password) < 8:
            raise ValidationError(_('Password length must be >= 8 characters'))
        else:

            return password

class ProfileForm(ModelForm):

    user = UserForm()
    class Meta:

        model = Profile
        fields = '__all__'
        exclude = ['created_at','user']

    def clean_dob(self):

        date = self.cleaned_data.get('dob')
        if not date:
            raise ValidationError(_("Date of birth required"))
        if date > datetime.date.today():

            raise ValidationError(_("Invalid date"))

        else:
            return date

    def clean_city(self):

        city = self.cleaned_data.get('city')

        if not city:
            raise ValidationError(_('city required'))

        return city

    def clean_phone_number(self):

        phone_number = self.cleaned_data.get('phone_number')

        if not phone_number:
            raise ValidationError(_('phone number required'))



class LoginForm(forms.Form):

    username = forms.CharField(max_length=120)
    password = forms.CharField(widget=forms.PasswordInput)


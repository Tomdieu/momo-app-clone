from django.forms import ModelForm,inlineformset_factory,MultiValueField
from django import forms
from django.core.validators import RegexValidator
from .models import Profile

from django.contrib.auth import get_user_model


User = get_user_model()


class PhoneField(MultiValueField):
    def __init__(self, **kwargs):
        # Define one message for all fields.
        error_messages = {
            'incomplete': 'Enter a country calling code and a phone number.',
        }
        # Or define a different message for each field.
        fields = (
            forms.CharField(
                error_messages={'incomplete': 'Enter a country calling code.'},
                validators=[
                    RegexValidator(r'^[0-9]+$', 'Enter a valid country calling code.'),
                ],
                help_text='country phone code'
            ),
            forms.CharField(
                error_messages={'incomplete': 'Enter a phone number.'},
                validators=[RegexValidator(r'^[0-9]+$', 'Enter a valid phone number.')],
            ),
            # forms.CharField(
            #     validators=[RegexValidator(r'^[0-9]+$', 'Enter a valid extension.')],
            #     required=False,
            # ),
        )
        super().__init__(
            error_messages=error_messages, fields=fields,
            require_all_fields=False, **kwargs
        )

class UserForm(ModelForm):
    
    confirm_password = forms.CharField(max_length=120)
    
    class Meta:

        model = User
        fields = ['username','first_name','last_name','email','password','confirm_password']


    def clean_confirm_password(self):
        pass



class ProfileForm(ModelForm):

    user = UserForm()
    phone_number = PhoneField()
    dob = forms.DateField()
    class Meta:

        model = Profile
        fields = '__all__'
        exclude = ['created_at','user']

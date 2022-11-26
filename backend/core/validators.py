from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def IsAgent(id):
    from .models import Account
    instance = Account.objects.get(pk=id)
    if instance.is_agent == False:
        raise ValidationError(_('%(value)s is not an agent account!'),params={'value':instance})
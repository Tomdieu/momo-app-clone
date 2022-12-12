from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

import re

def IsAgent(account):
    from .models import Account
    if isinstance(account,Account):
        instance = Account.objects.get(pk=account.id)
    else:
        instance = Account.objects.get(pk=account)   
    if instance.is_agent == False:
        raise ValidationError(_('%(value)s is not an agent account!'),params={'value':instance})

def validate_pin_code(code:str) -> bool:
    """

    Args:
        code (str): a pin code

    Returns:
        bool: True if the pin code matches the pattern otherwise False
    """

    ptn = re.compile(r"^(\d){5}$")
    if ptn.match(code):
        return True
    return False
from rest_framework.permissions import BasePermission

def IsAgent(BasePermission):

    def has_permission(self,request, view):
        return bool(request.user and request.user.account.is_agent)
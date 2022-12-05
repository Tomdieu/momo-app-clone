from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs

from channels.auth import UserLazyObject

@database_sync_to_async
def get_user(token_string):
    try:
        return Token.objects.get(key=token_string).user
    except:
        return AnonymousUser()


class TokenAuthMiddleWare(BaseMiddleware):
    def populate_scope(self, scope):
        if "user" not in scope:
            scope["user"] = UserLazyObject()

    async def resolve_scope(self, scope):
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        scope["user"]._wrapped = await get_user(token)

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        # Scope injection/mutation per this middleware's needs.
        self.populate_scope(scope)
        # Grab the finalized/resolved scope
        await self.resolve_scope(scope)

        return await super().__call__(scope, receive, send)

# from rest_framework.authtoken.models import Token
# from urllib.parse import parse_qs
# from channels.db import database_sync_to_async
# from django.contrib.auth.models import AnonymousUser
# from channels.middleware import BaseMiddleware

# # User = get_user_model()

# @database_sync_to_async
# def returnUser(token_string):
#     try:
#         user = Token.objects.get(key=token_string).user
#     except:
#         user = AnonymousUser()

#     return user


# class TokenAuthMiddleWare(BaseMiddleware):
#     def __init__(self, inner):
#         # Store the ASGI application we were passed
#         self.inner = inner

#     async def __call__(self, scope,receive,send):
        
#         token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]

#         user = await returnUser(token)
#         # Copy scope to stop changes going upstream
        
#         scope['user'] = user

#         print(scope)

#         # Run the inner application along with the scope
#         # return await self.inner(scope, receive, send)

#         return await super().__call__(scope,receive, send)
        
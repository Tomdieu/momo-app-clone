from channels.routing import ProtocolTypeRouter,URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path

from notifications.middlewares import TokenAuthMiddleWare

application = ProtocolTypeRouter(
    {
        "websocket":TokenAuthMiddleWare(
            AllowedHostsOriginValidator(
                URLRouter(
                    [
                        # path("",)
                    ]
                )
            )
        )
    }
)
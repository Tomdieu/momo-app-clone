from channels.generic.websocket import AsyncConsumer,AsyncJsonWebsocketConsumer


class UserNotification(AsyncConsumer):

    # room_group_name = 'notifications'

    async def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['user_id']
        # self.room_group_name = f'notifications_{self.room_name}'

        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )

        await self.accept()

    # async def disconnect(self,code):
    #     await self.channel_layer.group_discard(
    #         self.room_group_name,
    #         self.channel_layer
    #     )

    # async def status_notifier(self,event):
    #     await self.send_json(event)
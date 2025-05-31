# type: ignore

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ..Models.Chat import ChatRoom, Message, ChatRoomMember
from django.core.exceptions import ObjectDoesNotExist

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope["user"]

        # Verify user is member of the chat room
        if await self.is_valid_room_member():
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        # Save message to database
        await self.save_message(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user.id,
                'sender_name': self.user.get_full_name()
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name']
        }))

    @database_sync_to_async
    def is_valid_room_member(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return ChatRoomMember.objects.filter(
                chat_room=room,
                user=self.user,
                is_active=True
            ).exists()
        except ObjectDoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, message_content):
        chat_room = ChatRoom.objects.get(id=self.room_id)
        return Message.objects.create(
            chat_room=chat_room,
            sender=self.user,
            content=message_content
        ) 


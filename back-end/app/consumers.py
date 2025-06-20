import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from .Models.chat import ChatRoom, ChatParticipant, ChatMessage, MessageReadStatus

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection"""
        # Get room_id from URL
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Get token from query string
        query_string = self.scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        if token:
            try:
                # Validate token and get user
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                self.user = await self.get_user(user_id)
            except Exception as e:
                print(f"Token validation error: {str(e)}")
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()
        
        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close(code=4001)
            return
        
        # Check if user is a participant in this room
        is_participant = await self.check_user_is_participant()
        if not is_participant:
            await self.close(code=4002)
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send user joined notification to room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user_id': self.user.id,
                'username': self.user.username
            }
        )
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'room_group_name'):
            # Send user left notification to room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_left',
                    'user_id': self.user.id,
                    'username': self.user.username
                }
            )
            
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle received WebSocket message"""
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', 'chat_message')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(text_data_json)
            elif message_type == 'typing':
                await self.handle_typing(text_data_json)
            elif message_type == 'mark_read':
                await self.handle_mark_read(text_data_json)
            else:
                await self.send_error("Unknown message type")
                
        except json.JSONDecodeError:
            await self.send_error("Invalid JSON")
        except Exception as e:
            await self.send_error(f"Error processing message: {str(e)}")
    
    async def handle_chat_message(self, data):
        content = data.get('content', '').strip()
        message_type = data.get('message_type', 'text')
        
        if not content and message_type == 'text':
            await self.send_error("Message content cannot be empty")
            return
        
        # Save message to database
        message = await self.save_message(content, message_type, data)
        
        if message:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id': message.id,
                        'content': message.content,
                        'message_type': message.message_type,
                        'sender': {
                            'id': message.sender.id,
                            'username': message.sender.username,
                            'user_type': message.sender.user_type
                        },
                        'created_at': message.created_at.isoformat(),
                        'file_url': message.file_url,
                        'file_name': message.file_name,
                        'file_size': message.file_size
                    }
                }
            )
    
    async def handle_typing(self, data):
        is_typing = data.get('is_typing', False)
        
        # Send typing indicator to room group (excluding sender)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': self.user.username,
                'is_typing': is_typing
            }
        )
    # حذف 
    async def handle_mark_read(self, data):
        """Handle mark messages as read"""
        message_ids = data.get('message_ids', [])
        
        if message_ids:
            await self.mark_messages_read(message_ids)
            
            # Notify room about read status
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'messages_read',
                    'user_id': self.user.id,
                    'message_ids': message_ids
                }
            )
    
    # WebSocket message handlers
    async def chat_message(self, event):
        """Send chat message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))
    
    async def user_joined(self, event):
        """Send user joined notification"""
        if event['user_id'] != self.user.id:  # Don't send to the user who joined
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'user_id': event['user_id'],
                'username': event['username']
            }))
    
    async def user_left(self, event):
        """Send user left notification"""
        if event['user_id'] != self.user.id:  # Don't send to the user who left
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'user_id': event['user_id'],
                'username': event['username']
            }))
    
    async def typing_indicator(self, event):
        """Send typing indicator"""
        if event['user_id'] != self.user.id:  # Don't send to the user who is typing
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing']
            }))
    
    async def messages_read(self, event):
        """Send messages read notification"""
        if event['user_id'] != self.user.id:  # Don't send to the user who marked as read
            await self.send(text_data=json.dumps({
                'type': 'messages_read',
                'user_id': event['user_id'],
                'message_ids': event['message_ids']
            }))
    
    async def send_error(self, error_message):
        """Send error message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))
    
    # Database operations
    @database_sync_to_async
    def check_user_is_participant(self):
        """Check if user is a participant in the chat room"""
        try:
            return ChatParticipant.objects.filter(
                room_id=self.room_id,
                user=self.user,
                is_active=True
            ).exists()
        except:
            return False
    
    @database_sync_to_async
    def save_message(self, content, message_type, data):
        """Save message to database"""
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            
            message = ChatMessage.objects.create(
                room=room,
                sender=self.user,
                content=content,
                message_type=message_type,
                file_url=data.get('file_url'),
                file_name=data.get('file_name'),
                file_size=data.get('file_size')
            )
            
            # Update room's updated_at timestamp
            room.updated_at = timezone.now()
            room.save()
            
            return message
        except Exception as e:
            print(f"Error saving message: {e}")
            return None
    
    @database_sync_to_async
    def mark_messages_read(self, message_ids):
        """Mark messages as read"""
        try:
            messages = ChatMessage.objects.filter(
                id__in=message_ids,
                room_id=self.room_id
            ).exclude(sender=self.user)
            
            for message in messages:
                MessageReadStatus.objects.get_or_create(
                    message=message,
                    user=self.user
                )
            
            # Update participant's last read time
            participant = ChatParticipant.objects.filter(
                room_id=self.room_id,
                user=self.user
            ).first()
            
            if participant:
                participant.last_read_at = timezone.now()
                participant.save()
                
        except Exception as e:
            print(f"Error marking messages as read: {e}")
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for general notifications
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group_name = f'user_{self.user.id}'
        
        # Join user's personal group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle received WebSocket message"""
        # This consumer is mainly for receiving notifications
        pass
    
    async def new_message_notification(self, event):
        """Send new message notification"""
        await self.send(text_data=json.dumps({
            'type': 'new_message_notification',
            'room_id': event['room_id'],
            'room_name': event['room_name'],
            'sender': event['sender'],
            'message_preview': event['message_preview']
        }))
    
    async def new_chat_room_notification(self, event):
        """Send new chat room notification"""
        await self.send(text_data=json.dumps({
            'type': 'new_chat_room',
            'room_id': event['room_id'],
            'room_name': event['room_name'],
            'created_by': event['created_by']
        }))

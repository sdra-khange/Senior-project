# type: ignore

from django.urls import re_path
from .consumers import VideoCallConsumer
from .ChatConsumer import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/call/(?P<room_name>\w+)/$', VideoCallConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_id>\w+)/$', ChatConsumer.as_asgi()),
] 
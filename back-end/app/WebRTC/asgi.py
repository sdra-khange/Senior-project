from WebRTC import ProtocolTypeRouter, URLRouter
from WebRTC.asgi import get_asgi_application
from WebRTC.routring import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})

import jwt
import time
from datetime import datetime, timedelta
from project.livekit_config import (
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    LIVEKIT_WS_URL,
    DEFAULT_ROOM_TTL,
    MAX_PARTICIPANTS
)
from app.Models.livekit import LiveKitRoom

class LiveKitService:
    def __init__(self):
        self.api_key = LIVEKIT_API_KEY
        self.api_secret = LIVEKIT_API_SECRET
        self.ws_url = LIVEKIT_WS_URL

    def create_room(self, room_name: str, user, ttl: int = DEFAULT_ROOM_TTL) -> dict:
        # Generate token for room creation
        token = self._generate_token(
            room_name=room_name,
            participant_name="host",
            can_publish=True,
            can_subscribe=True
        )
        
        # Create room in database
        room = LiveKitRoom.objects.create(
            room_name=room_name,
            created_by=user
        )
        
        return {
            "room_name": room_name,
            "token": token,
            "ws_url": self.ws_url
        }

    def get_room_token(self, room_name: str, participant_name: str, user_type: str = "participant") -> str:
        # Set permissions based on user type
        can_publish = user_type == "doctor"
        can_subscribe = True  # All users can subscribe
        
        return self._generate_token(
            room_name=room_name,
            participant_name=participant_name,
            can_publish=can_publish,
            can_subscribe=can_subscribe
        )

    def _generate_token(self, room_name: str, participant_name: str,
                       can_publish: bool = False, can_subscribe: bool = True) -> str:
        exp = int(time.time()) + 3600

        # Create the token payload according to LiveKit specification
        payload = {
            "iss": self.api_key,
            "sub": participant_name,
            "exp": exp,
            "nbf": int(time.time()),
            "video": {
                "roomJoin": True,
                "room": room_name,
                "canPublish": can_publish,
                "canSubscribe": can_subscribe,
                "canPublishData": True
            }
        }

        # Generate JWT token
        token = jwt.encode(
            payload,
            self.api_secret,
            algorithm="HS256"
        )

        return token

    def list_rooms(self) -> list:
        # Get active rooms from database
        rooms = LiveKitRoom.objects.filter(is_active=True)
        return [{
            "room_name": room.room_name,
            "created_by": room.created_by.username,
            "created_at": room.created_at.isoformat()
        } for room in rooms]

    def delete_room(self, room_name: str) -> bool:
        try:
            room = LiveKitRoom.objects.get(room_name=room_name)
            room.delete()
            return True
        except LiveKitRoom.DoesNotExist:
            return False
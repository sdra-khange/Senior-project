# type: ignore

from ..Models.Video_call import VideoRoom
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid

class VideoCallService:
    @staticmethod
    def get_available_rooms(doctor_id=None, patient_id=None, date=None):
        """Get filtered video rooms based on parameters"""
        rooms = VideoRoom.objects.all()
        
        if doctor_id:
            rooms = rooms.filter(doctor_id=doctor_id)
        if patient_id:
            rooms = rooms.filter(patient_id=patient_id)
        if date:
            rooms = rooms.filter(created_at__date=date)
            
        return rooms.filter(status__in=['waiting', 'active'])

    @staticmethod
    def create_room(doctor_id, patient_id, session_id):
        """Create a new video room"""
        # Check if there's already an active room
        existing_room = VideoRoom.objects.filter(
            doctor_id=doctor_id,
            patient_id=patient_id,
            session_id=session_id,
            status__in=['waiting', 'active']
        ).first()

        if existing_room:
            raise ValidationError("Active room already exists for this session")

        room = VideoRoom.objects.create(
            doctor_id=doctor_id,
            patient_id=patient_id,
            session_id=session_id,
            status='waiting'
        )
        
        return room

    @staticmethod
    def join_room(room_id, user, user_type):
        """Join a video room"""
        room = VideoRoom.objects.get(room_id=room_id)
        
        # Validate user permission
        if user_type == 'doctor' and room.doctor_id != user.id:
            raise ValidationError("Unauthorized access")
        if user_type == 'patient' and room.patient_id != user.id:
            raise ValidationError("Unauthorized access")

        if room.status == 'ended':
            raise ValidationError("This room has ended")

        # Update room status to active if it was waiting
        if room.status == 'waiting':
            room.status = 'active'
            room.save()

        # Generate room details including WebRTC configuration
        room_details = {
            'room_id': str(room.room_id),
            'status': room.status,
            'ice_servers': [
                {
                    'urls': 'stun:stun.l.google.com:19302'
                },
                # Add your TURN server configuration here
                {
                    'urls': 'turn:your-turn-server.com',
                    'username': 'username',
                    'credential': 'password'
                }
            ],
            'user_type': user_type
        }

        return room_details

    @staticmethod
    def end_call(room_id, user):
        """End a video call"""
        room = VideoRoom.objects.get(room_id=room_id)
        
        # Validate that user is either doctor or patient
        if user.id not in [room.doctor_id, room.patient_id]:
            raise ValidationError("Unauthorized access")

        room.status = 'ended'
        room.ended_at = timezone.now()
        room.save()

        return room

    @staticmethod
    def handle_signal(room_id, user, signal_type, signal_data):
        """Handle WebRTC signaling"""
        room = VideoRoom.objects.get(room_id=room_id)
        
        # Validate user is part of the room
        if user.id not in [room.doctor_id, room.patient_id]:
            raise ValidationError("Unauthorized access")

        if room.status != 'active':
            raise ValidationError("Room is not active")

        # Here you would typically send the signal through your WebSocket consumer
        # This is just a placeholder for the actual WebSocket implementation
        from channels.layers import get_channel_layer
        from asgi_redis import RedisChannelLayer
        channel_layer = get_channel_layer()

        # Send signal to room group
        async_to_sync(channel_layer.group_send)(
            f'videoroom_{room_id}',
            {
                'type': 'signal.message',
                'signal_type': signal_type,
                'signal_data': signal_data,
                'sender_id': user.id
            }
        )

    @staticmethod
    def get_room_status(room_id):
        """Get current status of a room"""
        room = VideoRoom.objects.get(room_id=room_id)
        return {
            'status': room.status,
            'created_at': room.created_at,
            'ended_at': room.ended_at
        }

    @staticmethod
    def get_active_rooms_for_user(user_id, user_type):
        """Get all active rooms for a specific user"""
        filter_kwargs = {
            f'{user_type}_id': user_id,
            'status__in': ['waiting', 'active']
        }
        return VideoRoom.objects.filter(**filter_kwargs)



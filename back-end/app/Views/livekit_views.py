from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app.Services.livekit_service import LiveKitService

class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response(
                {"error": "room_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        livekit_service = LiveKitService()
        try:
            room_data = livekit_service.create_room(room_name, request.user)
            return Response(room_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response(
                {"error": "room_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get user type from request user
        user_type = getattr(request.user, 'user_type', 'participant')
        
        livekit_service = LiveKitService()
        try:
            token = livekit_service.get_room_token(
                room_name=room_name,
                participant_name=request.user.username,
                user_type=user_type
            )
            
            return Response({
                "room_name": room_name,
                "token": token,
                "ws_url": livekit_service.ws_url
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ListRoomsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        livekit_service = LiveKitService()
        try:
            rooms = livekit_service.list_rooms()
            return Response(rooms)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteRoomView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, room_name):
        livekit_service = LiveKitService()
        try:
            success = livekit_service.delete_room(room_name)
            if success:
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(
                {"error": "Failed to delete room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_name = request.data.get('room_name')
        participant_name = request.data.get('participant_name')

        if not room_name:
            return Response(
                {"error": "room_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not participant_name:
            return Response(
                {"error": "participant_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get user type from request user
        user_type = getattr(request.user, 'user_type', 'participant')

        livekit_service = LiveKitService()
        try:
            token = livekit_service.get_room_token(
                room_name=room_name,
                participant_name=participant_name,
                user_type=user_type
            )

            return Response({
                "token": token,
                "ws_url": livekit_service.ws_url
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetTokenView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        room_name = request.data.get('room_name')
        participant_name = request.data.get('participant_name')
        
        if not room_name:
            return Response(
                {"error": "room_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not participant_name:
            return Response(
                {"error": "participant_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get user type from request user
        user_type = getattr(request.user, 'user_type', 'participant')
        
        livekit_service = LiveKitService()
        try:
            token = livekit_service.get_room_token(
                room_name=room_name,
                participant_name=participant_name,
                user_type=user_type
            )
            
            return Response({
                "token": token,
                "ws_url": livekit_service.ws_url
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

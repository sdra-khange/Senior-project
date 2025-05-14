from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..Models.Video_call import VideoRoom
from ..Services.VideoCallService import VideoCallService
from ..Serializers.VideoCall import VideoRoomSerializer
from datetime import datetime

class VideoRoomListCreate(APIView):
    serializer_class = VideoRoomSerializer

    def get(self, request):
        # Get query parameters
        doctor_id = request.query_params.get('doctor_id')
        patient_id = request.query_params.get('patient_id')
        date = request.query_params.get('date')

        # Use service to get filtered rooms
        rooms = VideoCallService.get_available_rooms(
            doctor_id=doctor_id,
            patient_id=patient_id,
            date=date
        )
        serializer = self.serializer_class(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            doctor_id = request.data.get('doctor_id')
            patient_id = request.data.get('patient_id')
            session_id = request.data.get('session_id')

            room = VideoCallService.create_room(
                doctor_id=doctor_id,
                patient_id=patient_id,
                session_id=session_id
            )
            
            serializer = self.serializer_class(room)
            return Response({
                "message": "Video room created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class VideoRoomDetail(APIView):
    serializer_class = VideoRoomSerializer

    def get(self, request, room_id):
        room = get_object_or_404(VideoRoom, pk=room_id)
        serializer = self.serializer_class(room)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, room_id):
        room = get_object_or_404(VideoRoom, pk=room_id)
        serializer = self.serializer_class(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Video room updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, room_id):
        room = get_object_or_404(VideoRoom, pk=room_id)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class VideoRoomJoin(APIView):
    def post(self, request, room_id):
        try:
            user = request.user  # Assuming authentication is implemented
            user_type = request.data.get('user_type')  # 'doctor' or 'patient'

            room_details = VideoCallService.join_room(
                room_id=room_id,
                user=user,
                user_type=user_type
            )

            return Response({
                "message": "Joined video room successfully",
                "data": room_details
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class VideoRoomEnd(APIView):
    def post(self, request, room_id):
        try:
            user = request.user
            
            VideoCallService.end_call(
                room_id=room_id,
                user=user
            )

            return Response({
                "message": "Video call ended successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class VideoRoomSignal(APIView):
    def post(self, request, room_id):
        try:
            signal_data = request.data.get('signal')
            signal_type = request.data.get('type')
            user = request.user

            VideoCallService.handle_signal(
                room_id=room_id,
                user=user,
                signal_type=signal_type,
                signal_data=signal_data
            )

            return Response({
                "message": "Signal processed successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
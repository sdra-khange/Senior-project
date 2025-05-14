# type: ignore

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..Models.sessions import Session
from ..Services.SessionService import SessionService
from ..Serializers.Sessions import SessionSerializer
from datetime import datetime
from accounts.models import User

class SessionListCreate(APIView):
    serializer_class = SessionSerializer

    def get(self, request):
        # Get query parameters
        doctor_id = request.query_params.get('doctor_id')
        date = request.query_params.get('date')
        session_type = request.query_params.get('session_type')

        # Use service to get filtered sessions
        sessions = SessionService.get_available_sessions(
            doctor_id=doctor_id,
            date=date,
            session_type=session_type
        )
        serializer = self.serializer_class(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Session created",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SessionRetrieveUpdateDelete(APIView):
    serializer_class = SessionSerializer

    def get(self, request, SessionID):
        session = get_object_or_404(Session, pk=SessionID)
        serializer = self.serializer_class(session)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, SessionID):
        session = get_object_or_404(Session, pk=SessionID)
        serializer = self.serializer_class(session, data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Session updated successfully",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, SessionID):
        session = get_object_or_404(Session, pk=SessionID)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SessionGenerate(APIView):
    def post(self, request):
        try:
            doctor = request.data.get('doctor')
            doctor = get_object_or_404(User, id=doctor)
            # doctor = request.data.get('doctor')
            start_date = datetime.strptime(request.data.get('start_date'), '%Y-%m-%d').date()
            end_date = datetime.strptime(request.data.get('end_date'), '%Y-%m-%d').date()
            daily_start_time = datetime.strptime(request.data.get('start_time'), '%H:%M').time()
            daily_end_time = datetime.strptime(request.data.get('end_time'), '%H:%M').time()
            session_types = request.data.get('session_types', ['VIDEO'])

            SessionService.generate_sessions(
                doctor=doctor,
                start_date=start_date,
                end_date=end_date,
                daily_start_time=daily_start_time,
                daily_end_time=daily_end_time,
                session_types=session_types
            )
            

            return Response({
                "message": "Sessions generated successfully"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class SessionBooking(APIView):
    def post(self, request, SessionID):
        try:
            patient = request.user  # Assuming you're using authentication
            session = SessionService.book_session(SessionID, patient)
            serializer = SessionSerializer(session)
            return Response({
                "message": "Session booked successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


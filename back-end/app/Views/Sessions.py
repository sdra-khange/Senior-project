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
from rest_framework.permissions import IsAuthenticated
from ..Serializers.Sessions import (
    DoctorListSerializer, DoctorDetailSerializer,
    SessionSerializer, BookingSerializer,
    BookingConfirmationSerializer,
    BookedSessionSerializer
)
from accounts.permissions import IsPatient



class SessionListCreate(APIView):
    serializer_class = SessionSerializer

    def get(self, request):
        doctor_id = request.query_params.get('doctor')
        status = request.query_params.get('status')
        
        queryset = Session.objects.all()
        
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if status and status != 'All':
            queryset = queryset.filter(status=status)
            
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
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





# 1. Doctors List
class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        doctors = User.objects.filter(user_type='doctor', is_active=True)
        serializer = DoctorListSerializer(doctors, many=True)
        return Response(serializer.data)

# 2. Doctor Details
class DoctorDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, doctor_id):
        try:
            doctor = User.objects.get(id=doctor_id, user_type='doctor', is_active=True)
            serializer = DoctorDetailSerializer(doctor)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": " The doctor is not existing "}, status=status.HTTP_404_NOT_FOUND)

# 3. Available Sessions to specific doctor
class DoctorSessionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, doctor_id):
        sessions = Session.objects.filter(doctor_id=doctor_id, status='FREE')
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)

# 4. Book Session
class BookSessionView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            session = Session.objects.get(id=serializer.validated_data['session_id'])
            session.status = 'BOOKED'
            session.patient = request.user
            session.save()
            
            # send accept booking session
            confirmation_serializer = BookingConfirmationSerializer(session)
            return Response(confirmation_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 5. Booking Confirmation
class BookingConfirmationView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    
    def get(self, request, booking_id):
        try:
            booking = Session.objects.get(id=booking_id, patient=request.user)
            serializer = BookingConfirmationSerializer(booking)
            return Response(serializer.data)
        except Session.DoesNotExist:
            return Response({"error": " This session is not available for booking "}, status=status.HTTP_404_NOT_FOUND)


# class PatientBookedSessionsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         try:
#             patient = request.user
#             booked_sessions = Session.objects.filter(
#                 patient=patient,
#                 status='BOOKED'
#             ).order_by('date', 'start_time')
            
#             serializer = BookedSessionSerializer(booked_sessions, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(
#                 {"error": str(e)},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

class PatientBookedSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = request.user
            booked_sessions = Session.objects.filter(
                patient=patient,
                status='BOOKED'
            ).order_by('date', 'start_time')
            
            serializer = BookedSessionSerializer(booked_sessions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, session_id):
        try:
            patient = request.user
            session = get_object_or_404(Session, id=session_id, patient=patient, status='BOOKED')

            session.patient = None  

            session.status = 'FREE' 

            session.save()

            return Response({"message": "The appointment was successfully deleted."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

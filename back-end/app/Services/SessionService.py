from datetime import datetime, timedelta
from ..Models.sessions import Session
from django.shortcuts import get_object_or_404


class SessionService:
    @staticmethod
    def generate_sessions(doctor, start_date, end_date, daily_start_time, daily_end_time, session_types):
        """Generate available sessions for a doctor"""
        current_date = start_date
        while current_date <= end_date:
            # Skip weekends
            if current_date.weekday() in [5, 6]:
                current_date += timedelta(days=1)
                continue

            current_time = daily_start_time
            while current_time < daily_end_time:
                # Calculate session end time based on doctor's duration
                end_time = (
                    datetime.combine(datetime.min, current_time) + 
                    timedelta(minutes=30)  # Default 30 minutes, adjust as needed
                ).time()

                # Create sessions for each type
                for session_type in session_types:
                    Session.objects.create(
                        doctor=doctor,
                        date=current_date,
                        start_time=current_time,
                        end_time=end_time,
                        session_type=session_type,
                        status='FREE'
                    )

                current_time = end_time
            current_date += timedelta(days=1)

    @staticmethod
    def get_available_sessions(doctor_id=None, date=None, session_type=None):
        """Get available sessions with filters"""
        filters = {'status': 'FREE'}
        
        if doctor_id:
            filters['doctor_id'] = doctor_id
        if date:
            filters['date'] = date
        if session_type:
            filters['session_type'] = session_type
            
        return Session.objects.filter(**filters).order_by('date', 'start_time')

    @staticmethod
    def book_session(session_id, patient):
        """Book a session"""
        session = get_object_or_404(Session, pk=session_id)
        if session.status != 'FREE':
            raise ValueError("Session is not available")
            
        session.status = 'BOOKED'
        session.patient = patient
        session.save()
        return session

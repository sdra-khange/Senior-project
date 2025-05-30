from django.urls import path
from .Views.Exam import DomainListCreate , DomainRetrieveUpdateDelete ,TestListCreate,TestRetrieveUpdateDelete , QuestionListCreate , QuestionRetrieveUpdateDelete , AnswerListCreate, AnswerRetrieveUpdateDelete,PublicContentList,ContentRetrieveUpdateDelete,ContentListCreate
from .Views.Sessions import (
    SessionListCreate,
    SessionRetrieveUpdateDelete,
    SessionGenerate,
    SessionBooking,
    DoctorListView, DoctorDetailView,
    DoctorSessionsView, BookSessionView,
    BookingConfirmationView,PatientBookedSessionsView
)
from .Views.VideoCall import (
    VideoRoomListCreate,
    VideoRoomDetail,
    VideoRoomJoin,
    VideoRoomEnd,
    VideoRoomSignal
)
from .Views.Chat import (
    ChatRoomListCreate, ChatRoomDetail,
    ChatMessages, ChatRoomMembers
)


urlpatterns = [
    # Domain 
    path('domains/', DomainListCreate.as_view(), name='domain-list-create'),
    path('domains/<int:Domain_ID>/', DomainRetrieveUpdateDelete.as_view(), name='domain-retrieve-update-delete'),  

    # Test
    path('tests/', TestListCreate.as_view(), name='test-list-create'),
    path('tests/<int:TestID>/', TestRetrieveUpdateDelete.as_view(), name='test-retrieve-update-delete'),

    # Question
    path('tests/<int:TestID>/questions/', QuestionListCreate.as_view(), name='question-list-create'),
    path('questions/<int:QuestionID>/', QuestionRetrieveUpdateDelete.as_view(), name='question-retrieve-update-delete'),

    # Answer
    path('questions/<int:QuestionID>/answers/', AnswerListCreate.as_view(), name='answer-list-create'),
    path('answers/<int:AnswerID>/', AnswerRetrieveUpdateDelete.as_view(), name='answer-retrieve-update-delete'),

    # Sessions
    path('sessions/', SessionListCreate.as_view(), name='session-list-create'),
    path('sessions/<int:SessionID>/', SessionRetrieveUpdateDelete.as_view(), name='session-detail'),
    path('sessions/generate/', SessionGenerate.as_view(), name='session-generate'),
    path('sessions/<int:SessionID>/book/', SessionBooking.as_view(), name='session-book'),

    # Video Rooms
    path('video-rooms/', VideoRoomListCreate.as_view(), name='video-room-list-create'),
    path('video-rooms/<str:room_id>/', VideoRoomDetail.as_view(), name='video-room-detail'),
    path('video-rooms/<str:room_id>/join/', VideoRoomJoin.as_view(), name='video-room-join'),
    path('video-rooms/<str:room_id>/end/', VideoRoomEnd.as_view(), name='video-room-end'),
    path('video-rooms/<str:room_id>/signal/', VideoRoomSignal.as_view(), name='video-room-signal'),

    # Chat URLs
    path('chat/rooms/', ChatRoomListCreate.as_view(), name='chat-rooms'),
    path('chat/rooms/<int:room_id>/', ChatRoomDetail.as_view(), name='chat-room-detail'),
    path('chat/rooms/<int:room_id>/messages/', ChatMessages.as_view(), name='chat-messages'),
    path('chat/rooms/<int:room_id>/members/', ChatRoomMembers.as_view(), name='chat-room-members'),
    path('chat/rooms/<int:room_id>/members/<int:member_id>/', ChatRoomMembers.as_view(), name='chat-room-member-delete'),
    
    
    # path booking patient doctor
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:doctor_id>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('doctors/<int:doctor_id>/sessions/', DoctorSessionsView.as_view(), name='doctor-sessions'),
    path('sessions/book/', BookSessionView.as_view(), name='book-session'),
    path('bookings/<int:booking_id>/', BookingConfirmationView.as_view(), name='booking-confirmation'),
    # Path to display the patient's booked sessions
    path('patient/appointments/', PatientBookedSessionsView.as_view(), name='patient-appointments'),
    # path('patient/appointments/<int:session_id>/', PatientBookedSessionsView.as_view(), name='patient-appointments-delete'),
    path('patient/appointments/<int:session_id>/cancel/', PatientBookedSessionsView.as_view(), name='patient-appointment-cancel'),
    
    
        # Content URLs
    path('content/', ContentListCreate.as_view(), name='content-list-create'),
    path('content/<int:pk>/', ContentRetrieveUpdateDelete.as_view(), name='content-detail'),
    path('public/content/', PublicContentList.as_view(), name='public-content-list'),
]





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

from .Views.livekit_views import (
    CreateRoomView,
    JoinRoomView,
    ListRoomsView,
    DeleteRoomView,
    GetTokenView
)

from .Views.chat import (
    ChatRoomListCreateView,
    ChatRoomDetailView,
    ChatMessageListCreateView,
    ChatParticipantManagementView,
    MarkMessagesReadView,PatientListView
)

from .Views.Blog import BlogPostListCreate , BlogPostRetrieveUpdateDelete , BlogPostLikeView, BlogWithMediaList


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
    # path('content/', ContentListCreate.as_view(), name='content-list-create'),
    # path('content/<int:pk>/', ContentRetrieveUpdateDelete.as_view(), name='content-detail'),
    # path('public/content/', PublicContentList.as_view(), name='public-content-list'),
    
    # LiveKit endpoints
    path('livekit/token/', GetTokenView.as_view(), name='livekit-token'),
    path('api/livekit/rooms/', CreateRoomView.as_view(), name='create-room'),
    path('api/livekit/rooms/join/', JoinRoomView.as_view(), name='join-room'),
    path('api/livekit/rooms/list/', ListRoomsView.as_view(), name='list-rooms'),
    path('api/livekit/rooms/<str:room_name>/', DeleteRoomView.as_view(), name='delete-room'),

    # Chat endpoints
    path('chat/rooms/', ChatRoomListCreateView.as_view(), name='chat-room-list-create'),
    path('chat/rooms/<int:room_id>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),
    path('chat/rooms/<int:room_id>/messages/', ChatMessageListCreateView.as_view(), name='chat-messages'),
    path('chat/rooms/<int:room_id>/participants/', ChatParticipantManagementView.as_view(), name='chat-participants'),
    path('chat/rooms/<int:room_id>/mark-read/', MarkMessagesReadView.as_view(), name='mark-messages-read'),
    
    path('patient/', PatientListView.as_view(), name='patient-list'),
    
    
    
    path('blog/', BlogPostListCreate.as_view(), name='blog-post-list-create'),
    path('blog/<int:pk>/', BlogPostRetrieveUpdateDelete.as_view(), name='blog-post-retrieve-update-delete'),
    path('blog/<int:pk>/like/', BlogPostLikeView.as_view(), name='blog-post-like'),
    path('blog/media/', BlogWithMediaList.as_view(), name='blog-with-media-list'),
]









from django.urls import path
from .Views.Exam import DomainListCreate , DomainRetrieveUpdateDelete ,TestListCreate,TestRetrieveUpdateDelete , QuestionListCreate , QuestionRetrieveUpdateDelete , AnswerListCreate, AnswerRetrieveUpdateDelete
from .Views.Sessions import (
    SessionListCreate,
    SessionRetrieveUpdateDelete,
    SessionGenerate,
    SessionBooking
)
from .Views.VideoCall import (
    VideoRoomListCreate,
    VideoRoomDetail,
    VideoRoomJoin,
    VideoRoomEnd,
    VideoRoomSignal
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
]



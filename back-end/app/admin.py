from django.contrib import admin
from .Models.exam import Domain, Test, Answer, Question, Content, ContentType
from .Models.sessions import Session
from .Models.livekit import LiveKitRoom
from .Models.chat import ChatRoom, ChatParticipant, ChatMessage, MessageReadStatus
from .Models.Blog import BlogMedia,BlogPost
# Register your models here.
admin.site.register(Domain)
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Session)
admin.site.register(Content)
admin.site.register(ContentType)
admin.site.register(LiveKitRoom)

admin.site.register(BlogMedia)
admin.site.register(BlogPost)
# Chat models
admin.site.register(ChatRoom)
admin.site.register(ChatParticipant)
admin.site.register(ChatMessage)
admin.site.register(MessageReadStatus)

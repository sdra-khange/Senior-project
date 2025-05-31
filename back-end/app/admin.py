from django.contrib import admin
from .Models.exam import Domain,Test,Answer,Question,Content,ContentType
from .Models.sessions import Session
from .Models.Chat import ChatRoom,ChatRoomMember
# Register your models here.
admin.site.register(Domain);
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Session)
admin.site.register(Content)
admin.site.register(ContentType)
admin.site.register(ChatRoom)
admin.site.register(ChatRoomMember)


from django.apps import AppConfig

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        from  ..app.Models.exam import  Domain , Test  # Room, VideoRoom, Session 
        from ..app.Models.Room import Room
        from ..app.Models.Video_call import VideoRoom
        from ..app.Models.sessions import Session
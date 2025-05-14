from rest_framework import serializers
from ..Models.Video_call import VideoRoom

class VideoRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoRoom
        fields = '__all__'
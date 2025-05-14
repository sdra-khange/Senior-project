# type: ignore

from rest_framework import serializers
from ..Models.sessions import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'

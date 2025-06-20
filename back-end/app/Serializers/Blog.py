# type: ignore

from rest_framework import serializers
from ..Models.Blog import BlogPost, BlogMedia



class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class BlogMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogMedia
        fields = '__all__'


class BlogPostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['title', 'content', 'is_active']





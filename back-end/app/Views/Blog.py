# type: ignore

from rest_framework.views import APIView
from ..Serializers.Blog import BlogPostSerializer, BlogMediaSerializer, BlogPostUpdateSerializer
from ..Models.Blog import BlogPost, BlogMedia
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404



class BlogPostListCreate(APIView):
    authentication_classes = []  
    permission_classes = [AllowAny]
    def get(self, request: Request):
        blog_posts = BlogPost.objects.filter(is_active=True)
        serializer = BlogPostSerializer(blog_posts, many=True)
        return Response(serializer.data)

    def post(self, request: Request):
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogPostRetrieveUpdateDelete(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def patch(self, request: Request, pk: int):
        blog_post = BlogPost.objects.get(pk=pk)
        serializer = BlogPostUpdateSerializer(blog_post, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request: Request, pk: int):
        blog_post = BlogPost.objects.get(BlogID=pk)
        blog_post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogPostLikeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request: Request, pk: int):
        blog_post = get_object_or_404(BlogPost, pk=pk)
        blog_post.Likes += 1
        blog_post.save()
        return Response({'likes': blog_post.Likes}, status=status.HTTP_200_OK)

class BlogWithMediaList(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request: Request):
        blog_posts = BlogPost.objects.filter(is_active=True)
        blog_media = BlogMedia.objects.filter(blog__in=blog_posts)
        serializer = BlogMediaSerializer(blog_media, many=True)
        blog_post_serializer = BlogPostSerializer(blog_posts, many=True)
        post=blog_post_serializer.data
        Media= serializer.data
        return Response({'post': post, 'Media': Media})
    def post(self, request: Request):
        serializer = BlogMediaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



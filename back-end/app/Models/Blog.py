from django.db import models
from accounts.models import User;
from .exam import Domain;



class BlogPost(models.Model):
    BlogID = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    DoctorID = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    DomainID = models.ForeignKey(Domain, on_delete=models.CASCADE)
    Likes = models.IntegerField(default=0)



class BlogMedia(models.Model):
    BLOG_MEDIA_TYPES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )
    blog = models.ForeignKey(BlogPost, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to='blog_media/')
    media_type = models.CharField(max_length=5, choices=BLOG_MEDIA_TYPES)

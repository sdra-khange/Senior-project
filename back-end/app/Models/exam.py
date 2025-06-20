from django.db import models
from accounts.models import User 
from django.utils.translation import gettext_lazy as _




class Domain(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Pending', 'Pending'),
    ]

    DomainID = models.AutoField(primary_key=True)  
    DomainName = models.CharField(max_length=50)  
    DomainDescription = models.TextField(max_length=200)
    Status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Active'
    )
    CreatedDate = models.DateTimeField(auto_now_add=True)  

    class Meta:
        ordering = ['-CreatedDate']  





class Test(models.Model):
    TestID = models.AutoField(primary_key=True)
    TestName = models.CharField(max_length=100)
    # Domain = models.ForeignKey(Domain, related_name='tests', on_delete=models.CASCADE) #? think about it!
    





class Question(models.Model):
    QuestionID = models.AutoField(primary_key=True)
    Test = models.ForeignKey(Test, related_name='questions', on_delete=models.CASCADE)
    QuestionText = models.CharField(max_length=200)



class Answer(models.Model):
    AnswerID = models.AutoField(primary_key=True)
    Question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    AnswerText = models.CharField(max_length=200)




class ContentType(models.Model):
    TypeID = models.AutoField(primary_key=True)
    TypeName = models.CharField(max_length=50)  
    TypeDescription = models.TextField(max_length=200)
    
    def __str__(self):
        return self.TypeName


class Content(models.Model):
    ContentID = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=100)
    Description = models.TextField()
    ContentType = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    Domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='contents')
    File = models.FileField(upload_to='content/', blank=True, null=True)  
    URL = models.URLField(blank=True, null=True)  
    CreatedBy = models.ForeignKey(User, on_delete=models.CASCADE) 
    CreatedDate = models.DateTimeField(auto_now_add=True)
    Status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    
    class Meta:
        ordering = ['-CreatedDate']
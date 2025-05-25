from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    CATEGORY_CHOICES = [
        ('nasa', 'NASA'),
        ('exoplanets', 'Exoplanets'),
        ('missions', 'Missions'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Comment(models.Model):
    blog = models.ForeignKey('Blog', related_name='comments', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.name}'

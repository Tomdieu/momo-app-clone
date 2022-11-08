from django.db import models
    
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)
    phone_number = models.CharField(max_length=255,null=True,blank=True) 
    dob = models.DateField(null=True,blank=True)
    city = models.CharField(max_length=255,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering=['created_at']


    def __str__(self):
        return self.user
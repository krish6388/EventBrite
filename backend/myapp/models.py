from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=122)
    mob = models.IntegerField()
    password = models.CharField(max_length=122)
    email = models.CharField(max_length=122, unique=True)

class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=122)
    event_time = models.DateTimeField(max_length=122)
    event_img = models.ImageField(upload_to='static/event_images/')
    event_data = models.TextField(default=100)
    event_loc = models.TextField(max_length=122)
    user_id = models.IntegerField()
    is_liked = models.BooleanField(default=False)

class Liking(models.Model):
   event_id = models.IntegerField()
   user_id = models.IntegerField()
   is_liked = models.BooleanField()

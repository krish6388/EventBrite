from django.contrib import admin
from myapp.models import User, Event, Liking

# Register your models here.
admin.site.register(User)
admin.site.register(Event)
admin.site.register(Liking)

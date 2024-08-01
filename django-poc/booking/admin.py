from django.contrib import admin
from .models import Service, Barber, Appointment

admin.site.register([Service, Barber, Appointment])

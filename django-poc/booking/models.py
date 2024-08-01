import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    duration = models.IntegerField()
    price = models.DecimalField(decimal_places=2, max_digits=10)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Barber(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    services = models.ManyToManyField(Service, related_name="barbers")
    start_office = models.TimeField()
    end_office = models.TimeField()
    start_lunch = models.TimeField()
    end_lunch = models.TimeField()
    weekdays = models.IntegerChoices(
        "Weekdays", "SUNDAY MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY SATURDAY"
    )

    available_days = ArrayField(
        models.IntegerField(choices=weekdays.choices), default=list
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    barber = models.ForeignKey(Barber, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=100)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    status = models.CharField(max_length=20, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.barber} serves {self.service} to {self.customer_name} on {self.booking_date} at {self.booking_time}"

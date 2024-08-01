from rest_framework import serializers
from .models import Appointment, Barber, Service


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class BarberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barber
        fields = "__all__"


class BarberDetailSerializer(BarberSerializer):
    services = ServiceSerializer(many=True, read_only=True)
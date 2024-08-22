from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, BarberViewSet, ServiceViewSet

routers = DefaultRouter()
routers.register("appointments", AppointmentViewSet, basename="appointment")
routers.register("services", ServiceViewSet, basename="service")
routers.register("barbers", BarberViewSet, basename="barber")

urlpatterns = routers.urls

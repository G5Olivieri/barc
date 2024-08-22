import datetime
import logging

from rest_framework import status, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from barc_auth.authentication import JWTAuthentication

from .models import Appointment, Barber, Service
from .serializers import (
    AppointmentSerializer,
    BarberDetailSerializer,
    BarberSerializer,
    ServiceSerializer,
)

logger = logging.getLogger(__name__)


class AllowListViewSetMixin:
    def get_permissions(self):
        if self.action == "list":
            return []
        return [IsAuthenticated()]


class ServiceViewSet(viewsets.ModelViewSet, AllowListViewSetMixin):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()
    pagination_class = LimitOffsetPagination


class BarberViewSet(viewsets.ModelViewSet, AllowListViewSetMixin):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Barber.objects.all()
    pagination_class = LimitOffsetPagination

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "list" or self.action == "retrieve":
            return BarberDetailSerializer
        return BarberSerializer

    @action(detail=True, methods=["get"], url_path="availabilities")
    def availabilities(self, request, pk=None):
        barber = self.get_object()
        duration = int(request.query_params.get("duration"))
        date = datetime.date.fromisoformat(request.query_params.get("date"))

        if not duration or not date:
            return Response(
                {"error": "Both 'duration' and 'date' query parameters are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Logic to get availabilities based on duration and date
        availabilities = self.get_barber_availabilities(barber, duration, date)

        return Response(
            [{"hour": a.hour, "minute": a.minute} for a in availabilities],
            status=status.HTTP_200_OK,
        )

    def get_barber_availabilities(
        self, barber: Barber, duration: int, date: datetime.date
    ) -> list[datetime.time]:
        appointments = Appointment.objects.filter(
            barber=barber, booking_date=date
        ).all()
        if not appointments:
            return self.get_barber_start_times(barber, duration)

        availabilities = []
        for starttime in self.get_barber_start_times(barber, duration):
            if not any(
                (
                    self.is_time_conflicting(appointment, starttime, duration)
                    for appointment in appointments
                )
            ):
                availabilities.append(starttime)
        return availabilities

    def is_time_conflicting(
        self,
        appointment: Appointment,
        time: datetime.time,
        duration: int,
    ) -> bool:
        return time <= appointment.booking_time < self.add_minutes(
            time, duration
        ) or appointment.booking_time <= time < self.add_minutes(
            appointment.booking_time, appointment.service.duration
        )

    def get_barber_start_times(
        self, barber: Barber, duration: int
    ) -> list[datetime.time]:
        step = 30
        start_office = barber.start_office
        start_lunch = barber.start_lunch
        end_lunch = barber.end_lunch
        end_office = barber.end_office

        start_times = []
        current_time = start_office
        while current_time < start_lunch:
            if (
                current_time
                <= barber.start_lunch
                < self.add_minutes(current_time, duration)
            ):
                break
            start_times.append(
                datetime.time(hour=current_time.hour, minute=current_time.minute)
            )
            current_time = self.add_minutes(current_time, step)

        current_time = end_lunch
        while current_time < end_office:
            if barber.end_office < self.add_minutes(current_time, duration):
                return start_times
            start_times.append(
                datetime.time(hour=current_time.hour, minute=current_time.minute)
            )
            current_time = self.add_minutes(current_time, step)
        return start_times

    def add_minutes(self, time: datetime.time, minutes: int) -> datetime.time:
        return (
            datetime.datetime.combine(datetime.date.today(), time)
            + datetime.timedelta(minutes=minutes)
        ).time()


class AppointmentViewSet(viewsets.ModelViewSet, AllowListViewSetMixin):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    pagination_class = LimitOffsetPagination

    def get_permissions(self):
        if self.action == "create":
            return []
        
        return super().get_permissions()

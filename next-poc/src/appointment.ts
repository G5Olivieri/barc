import { formatDate } from "date-fns";
import { Barber } from "./barber";
import { Service } from "./service";

export type Appointment = {
  barber: Barber;
  service: Service;
  client: {
    name: string;
    phone: string;
  };
  dateTime: Date;
};

export const createAppointment = async (appointment: Appointment) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/appointments/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: appointment.client.name,
        customer_phone: appointment.client.phone,
        booking_date: formatDate(appointment.dateTime, "yyyy-MM-dd"),
        booking_time: formatDate(appointment.dateTime, "HH:mm"),
        status: "requested",
        service: appointment.service.id,
        barber: appointment.barber.id,
      }),
    },
  );
};

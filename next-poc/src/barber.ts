import type { UUID } from "crypto";
import { formatDate } from "date-fns";
import { RequestOptions } from "./request";
import { toJSON } from "./response";
import { Service } from "./service";
import { buildTimeFromString, Time, timeToString } from "./time";

export type Barber = {
  id: UUID;
  name: string;
  services: Service[];
  startOffice: Time;
  endOffice: Time;
  startLunch: Time;
  endLunch: Time;
  availableDays: number[];
};

type BarberResponse = {
  id: UUID;
  name: string;
  services: Service[];
  start_office: string;
  end_office: string;
  start_lunch: string;
  end_lunch: string;
  available_days: number[];
};

const mapFromRemoteToBarber = (barber: BarberResponse) => ({
  id: barber.id,
  name: barber.name,
  services: barber.services,
  startOffice: buildTimeFromString(barber.start_office),
  endOffice: buildTimeFromString(barber.end_office),
  startLunch: buildTimeFromString(barber.start_lunch),
  endLunch: buildTimeFromString(barber.end_lunch),
  availableDays: barber.available_days,
});

export const fetchAvailabilities = async (
  barber: Barber,
  duration: number,
  date: Date,
  options?: RequestOptions,
): Promise<Time[]> => {
  const query = new URLSearchParams({
    duration: duration.toString(),
    date: formatDate(date, "yyyy-MM-dd"),
  });
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/barbers/${barber.id}/availabilities/?${query.toString()}`,
    {
      cache: options?.cache,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers ?? {}),
      },
    },
  ).then(toJSON<Time[]>);
};

export const fetchBarbers = async (options?: RequestOptions) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/barbers/`, {
    cache: options?.cache,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
  })
    .then(toJSON<BarberResponse[]>)
    .then((data) => data.map(mapFromRemoteToBarber));
};

export const fetchBarberById = async (
  barberId: UUID,
  options?: RequestOptions,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/barbers/${barberId}/`,
    {
      cache: options?.cache,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers ?? {}),
      },
    },
  ).then(toJSON<Barber>);
};

export const createBarber = async (
  barber: Omit<Barber, "id">,
  options?: RequestOptions,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/barbers/`, {
    method: "POST",
    cache: options?.cache,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify({
      name: barber.name,
      start_office: timeToString(barber.startOffice),
      end_office: timeToString(barber.endOffice),
      start_lunch: timeToString(barber.startLunch),
      end_lunch: timeToString(barber.endLunch),
      available_days: barber.availableDays,
      services: barber.services.map((s) => s.id),
    }),
  });
};

export const updateBarber = async (
  barber: Barber,
  options?: RequestOptions,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/barbers/${barber.id}/`,
    {
      method: "PUT",
      cache: options?.cache,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      body: JSON.stringify({
        id: barber.id,
        name: barber.name,
        start_office: barber.startOffice.toString(),
        end_office: barber.endOffice.toString(),
        start_lunch: barber.startLunch.toString(),
        end_lunch: barber.endLunch.toString(),
        available_days: barber.availableDays,
        services: barber.services,
      }),
    },
  );
};

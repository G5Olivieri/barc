import { UUID } from "crypto";
import { RequestOptions } from "./request";
import { toJSON } from "./response";

export type Service = {
  id: UUID;
  name: string;
  duration: number;
  price: number;
};

export const fetchServiceById = async (
  serviceId: UUID,
  options?: RequestOptions,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/services/${serviceId}/`,
    {
      cache: options?.cache,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers ?? {}),
      },
    },
  ).then(toJSON<Service>);
};

export const fetchServices = async (
  /* TODO: gambs */ options?: RequestOptions,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/services/`, {
    cache: options?.cache,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
  }).then(toJSON<Service[]>);
};

export const createService = async (
  service: Omit<Service, "id">,
  options?: RequestOptions,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/services/`, {
    method: "POST",
    cache: options?.cache,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify({
      name: service.name,
      duration: service.duration,
      price: service.price,
    }),
  });
};

export const updateService = async (
  service: Service,
  options?: RequestOptions,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${service.id}/`,
    {
      method: "PUT",
      cache: options?.cache,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      body: JSON.stringify({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
      }),
    },
  );
};

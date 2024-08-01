"use client";
import React from "react";
import { BarberForm, InputData } from "../components/form";
import { Service } from "@/service";
import { createBarber } from "@/barber";

type NewBarberFormProps = {
  services: Service[];
};

export const NewBarberForm: React.FC<NewBarberFormProps> = ({ services }) => {
  // TODO: use form action
  const onSubmit = async (data: InputData) => {
    const {
      name,
      endOffice,
      startOffice,
      endLunch,
      startLunch,
      weekdays,
      services: selectedServices,
    } = data;
    await createBarber(
      {
        name,
        availableDays: weekdays,
        startOffice,
        endOffice,
        startLunch,
        endLunch,
        services: selectedServices,
      },
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie
              .split(";")
              .map((c) => c.trim())
              .find((c) => c.startsWith("jwt="))
              ?.split("=")[1]
          }`,
        },
      },
    ).then(() => {
      // eslint-disable-next-line react-compiler/react-compiler
      window.location.href = "/admin/barbers";
    });
  };

  return (
    <BarberForm submitMessage="Criar" services={services} onSubmit={onSubmit} />
  );
};

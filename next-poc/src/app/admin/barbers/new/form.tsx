"use client";
import { Service } from "@/app/types";
import React from "react";
import { BarberForm, InputData } from "../components/form";

type NewBarberFormProps = {
  services: Service[];
};
export const NewBarberForm: React.FC<NewBarberFormProps> = ({ services }) => {
  const onSubmit = async (data: InputData) => {
    const {
      name,
      officehoursEnd,
      officehoursStart,
      lunchTimeEnd,
      lunchTimeStart,
      selectedDays,
      selectedServices,
    } = data;
    const officehours = [
      {
        start: { hour: officehoursStart.hour, minute: officehoursStart.minute },
        end: { hour: lunchTimeStart.hour, minute: lunchTimeStart.minute },
      },
      {
        start: { hour: lunchTimeEnd.hour, minute: lunchTimeEnd.minute },
        end: { hour: officehoursEnd.hour, minute: officehoursEnd.minute },
      },
    ];
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("jwt="))
            ?.split("=")[1]
        }`,
      },
      body: JSON.stringify({
        name: data.name,
        officehours,
        weekdays: selectedDays.sort((a, b) => a - b),
        services: selectedServices.map((s) => s.value),
      }),
    });
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/barbers";
  };

  return (
    <BarberForm submitMessage="Criar" services={services} onSubmit={onSubmit} />
  );
};

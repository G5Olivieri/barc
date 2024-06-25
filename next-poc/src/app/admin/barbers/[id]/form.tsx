"use client";
import { Barber, Service } from "@/app/types";
import { Time } from "@/time";
import React from "react";
import { BarberForm, InputData } from "../components/form";

type UpdateBarberFormProps = {
  barber: Barber;
  services: Service[];
};
export const UpdateBarberForm: React.FC<UpdateBarberFormProps> = ({
  barber,
  services,
}) => {
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
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers/${barber.id}`,
      {
        method: "PUT",
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
          name,
          officehours,
          weekdays: selectedDays.sort((a, b) => a - b),
          services: selectedServices.map((s) => s.value),
        }),
      },
    );
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/barbers";
  };

  return (
    <BarberForm
      submitMessage="Atualizar"
      services={services}
      defaultValues={{
        name: barber.name,
        selectedDays: barber.weekdays,
        selectedServices: barber.services.map((s) => ({
          value: s.id,
          label: s.name,
        })),
        officehoursStart: Time.fromObject(barber.officehours[0].start),
        officehoursEnd: Time.fromObject(barber.officehours[1].end),
        lunchTimeStart: Time.fromObject(barber.officehours[0].end),
        lunchTimeEnd: Time.fromObject(barber.officehours[1].start),
      }}
      onSubmit={onSubmit}
    />
  );
};

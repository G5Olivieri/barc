"use client";
import React from "react";
import { BarberForm, InputData } from "../components/form";
import { Barber, updateBarber } from "@/barber";
import { Service } from "@/service";

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
      endOffice,
      startOffice,
      endLunch,
      startLunch,
      weekdays: selectedDays,
      services: selectedServices,
    } = data;
    await updateBarber({
      id: barber.id,
      name,
      availableDays: selectedDays,
      startOffice,
      endOffice,
      startLunch,
      endLunch,
      services: selectedServices,
    });
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/barbers";
  };

  return (
    <BarberForm
      submitMessage="Atualizar"
      services={services}
      defaultValues={{
        name: barber.name,
        weekdays: barber.availableDays,
        services: barber.services,
      }}
      onSubmit={onSubmit}
    />
  );
};

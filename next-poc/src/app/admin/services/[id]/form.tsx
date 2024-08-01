"use client";

import { Service, updateService } from "@/service";
import { InputData, ServiceForm } from "../components/form";

type UpdateServiceFormProps = {
  service: Service;
};

export const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({
  service,
}) => {
  const onSubmit = async (data: InputData) => {
    const { price, name, duration } = data;
    const jwt = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("jwt="))
      ?.split("=")[1];
    await updateService(
      { id: service.id, name, duration, price },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/services";
  };

  return (
    <ServiceForm
      submitMessage="Atualizar"
      onSubmit={onSubmit}
      defaultValues={{
        name: service.name,
        duration: service.duration,
        price: service.price,
      }}
    />
  );
};

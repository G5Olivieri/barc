"use client";

import { Service } from "@/app/types";
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
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${service.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          duration,
          price: price.replaceAll(".", "").replaceAll(",", "."),
        }),
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
        duration: service.duration.toString(),
        price: service.price.toString().replaceAll(",", ".").replace(".", ","),
      }}
    />
  );
};

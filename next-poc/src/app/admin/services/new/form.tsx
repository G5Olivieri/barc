"use client";

import { createService } from "@/service";
import { InputData, ServiceForm } from "../components/form";

type NewServiceFormProps = {};

export const NewServiceForm: React.FC<NewServiceFormProps> = ({}) => {
  const onSubmit = async (data: InputData) => {
    const { price, name, duration } = data;
    const jwt = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("jwt="))
      ?.split("=")[1];
    await createService(
      {
        name,
        price,
        duration,
      },
      {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      },
    );
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/services";
  };

  return <ServiceForm submitMessage="Criar" onSubmit={onSubmit} />;
};

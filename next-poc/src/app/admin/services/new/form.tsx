"use client";

import { useForm } from "react-hook-form";

type NewServiceFormProps = {};

type InputData = {
  name: string;
  price: string;
  duration: string;
};

export const NewServiceForm: React.FC<NewServiceFormProps> = ({}) => {
  const { register, handleSubmit } = useForm<InputData>();

  const onSubmit = handleSubmit(async (data) => {
    const jwt = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("jwt="))
      ?.split("=")[1];
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/services";
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name-input">Nome</label>
        <input
          className="form-control"
          type="text"
          id="name-input"
          {...register("name", { required: true })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="price-input">Preço</label>
        <input
          className="form-control"
          type="text"
          id="price-input"
          inputMode="numeric"
          {...register("price", { required: true })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration-input">Duração (em minutos)</label>
        <input
          className="form-control"
          type="number"
          id="duration-input"
          inputMode="numeric"
          {...register("duration", { required: true })}
        />
      </div>
      <button className="btn-primary" type="submit">
        Criar
      </button>
    </form>
  );
};

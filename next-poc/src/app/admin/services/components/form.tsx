"use client";

import { PriceInput } from "@/app/components/price-input";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type InputData = {
  name: string;
  price: number;
  duration: number;
};

type ServiceFormProps = {
  defaultValues?: Partial<InputData>;
  onSubmit: (data: InputData) => void;
  submitMessage: string;
};

export const ServiceForm: React.FC<ServiceFormProps> = ({
  defaultValues,
  submitMessage,
  onSubmit,
}) => {
  const [price, setPrice] = useState(
    // TODO: use a better way to format the price
    defaultValues?.price?.toString().replaceAll(",", "").replace(".", ",") ??
      "",
  );
  const { register, handleSubmit } = useForm<InputData>({ defaultValues });

  const onSubmitInternal = handleSubmit((data) => {
    onSubmit({
      ...data,
      price: parseFloat(price.replaceAll(".", "").replace(",", ".")),
      duration: Number(data.duration),
    });
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmitInternal}>
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
        <PriceInput
          className="form-control"
          id="price-input"
          value={price}
          onChange={(price) => setPrice(price)}
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
        {submitMessage}
      </button>
    </form>
  );
};

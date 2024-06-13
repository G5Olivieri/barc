"use client";
import { InputMask } from "@react-input/mask";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Barber, Service } from "../types";
import { parse, formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";

type Inputs = {
  name: string;
  phone: string;
};

export default function ConfirmComponent({
  barber,
  service,
  time,
  date,
}: {
  barber: Barber;
  service: Service;
  time: string;
  date: string;
}) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit = handleSubmit(async (data: Inputs) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barber_id: barber.id,
        service_id: service.id,
        client: {
          name: data.name,
          phone: data.phone,
        },
        date_time: `${date}T${time}`,
      }),
    });
    router.push("/confirmed");
  });
  return (
    <main className="flex flex-col py-10 px-4 gap-6">
      <h1 className="text-2xl">Confirmar serviço</h1>
      <div className="flex flex-col">
        <h2>{barber.name}</h2>
        <div className="flex flex-col">
          <p>{service.name}</p>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span>{time}</span>
              <span>&bull;</span>
              <span>
                {formatDate(parse(date, "yyyy-MM-dd", new Date()), "PP", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <span>
              {new Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL",
              }).format(service.price)}
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name-input">Nome</label>
          <input
            className="border border-zinc-900 py-2 px-3 rounded"
            type="text"
            id="name-input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone-input">Celular (com DDD)</label>
          <InputMask
            mask="(__) _____-____"
            replacement={{ _: /[0-9]/ }}
            showMask
            className="border border-zinc-900 py-2 px-3 rounded"
            type="text"
            id="phone-input"
            {...register("phone", { required: true })}
          />
        </div>
        <button
          className="bg-zinc-900 text-zinc-100 py-2 px-3 rounded hover:bg-zinc-900/90"
          type="submit"
        >
          confirmar
        </button>
      </form>
    </main>
  );
}

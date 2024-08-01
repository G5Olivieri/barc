"use client";
import { InputMask } from "@react-input/mask";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { parse, formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Barber } from "../../barber";
import { createAppointment } from "@/appointment";
import { Service } from "@/service";

type Inputs = {
  name: string;
  phone: string;
};

export default function ConfirmComponent({
  barber,
  service,
  time: strTime,
  date: strDate,
}: {
  barber: Barber;
  service: Service;
  time: string;
  date: string;
}) {
  const date = parse(`${strDate} ${strTime}`, "yyyy-MM-dd HH:mm", new Date());
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit = handleSubmit(async (data: Inputs) => {
    await createAppointment({
      barber,
      service,
      client: data,
      dateTime: date,
    });
    router.push("/confirmed");
  });
  return (
    <main className="flex flex-col py-10 px-4 gap-6">
      <h1 className="text-2xl">Confirmar serviço</h1>
      <div>
        <h2 className="text-xl">{barber.name}</h2>
        <div className="flex justify-between">
          <div>
            <p>{service.name}</p>
            <div className="flex gap-1">
              <span>{strTime}</span>
              <span>&bull;</span>
              <span>
                {formatDate(date, "PP", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
          <div className="self-end">
            <span className="text-xl">
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
          Confirmar
        </button>
      </form>
    </main>
  );
}

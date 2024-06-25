import { Barber, Service } from "@/app/types";
import { cookies } from "next/headers";
import { BarberForm } from "../components/form";
import { babelIncludeRegexes } from "next/dist/build/webpack-config";
import { Time } from "@/time";
import { UpdateBarberForm } from "./form";

export default async function BarberPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const jwt = cookies().get("jwt");

  const barber = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers/${id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  ).then((res) => res.json() as Promise<Barber>);

  const services = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  ).then((res) => res.json() as Promise<Service[]>);

  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Atualizar barbeiro</h1>
      <UpdateBarberForm barber={barber} services={services} />
    </div>
  );
}

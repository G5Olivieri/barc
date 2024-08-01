import { fetchBarberById } from "@/barber";
import { fetchServices } from "@/service";
import { UUID } from "crypto";
import { cookies } from "next/headers";
import { UpdateBarberForm } from "./form";

export default async function BarberPage({
  params: { id },
}: {
  params: { id: UUID };
}) {
  const jwt = cookies().get("jwt");

  if (!jwt) {
    return "Unauthorized";
  }

  const barber = await fetchBarberById(id, {
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
    cache: "no-cache",
  });

  const services = await fetchServices({
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
    cache: "no-cache",
  });

  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Atualizar barbeiro</h1>
      <button type="button" disabled className="bg-red-700 text-white py-2 rounded disabled:opacity-20">DELETAR</button>
      <UpdateBarberForm barber={barber} services={services} />
    </div>
  );
}

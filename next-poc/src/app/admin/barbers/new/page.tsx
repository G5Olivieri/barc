import { cookies } from "next/headers";
import { NewBarberForm } from "./form";
import { Service } from "@/app/types";

export default async function NewBarber() {
  const jwt = cookies().get("jwt");
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
      <h1 className="text-2xl">Adicionar barbeiro</h1>
      <NewBarberForm services={services}/>
    </div>
  );
}

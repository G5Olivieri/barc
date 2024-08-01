import { cookies } from "next/headers";
import { NewBarberForm } from "./form";
import { fetchServices } from "@/service";

export default async function NewBarber() {
  const jwt = cookies().get("jwt");
  if (!jwt) {
    return "Unauthorized";
  }
  const services = await fetchServices({
    headers: {
      authorization: `Bearer ${jwt.value}`,
    },
    cache: "no-cache",
  });
  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Adicionar barbeiro</h1>
      <NewBarberForm services={services} />
    </div>
  );
}

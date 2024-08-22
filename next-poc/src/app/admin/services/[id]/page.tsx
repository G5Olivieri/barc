import { fetchServiceById } from "@/service";
import { UUID } from "crypto";
import { cookies } from "next/headers";
import { UpdateServiceForm } from "./form";

export default async function ServicePage({
  params: { id },
}: {
  params: { id: UUID };
}) {
  const jwt = cookies().get("jwt");

  if (!jwt) {
    return "Unauthorized";
  }
  const service = await fetchServiceById(id, {
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  });

  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Atualizar serviço</h1>
      <UpdateServiceForm service={service} />
    </div>
  );
}

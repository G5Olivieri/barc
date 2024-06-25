import { Service } from "@/app/types";
import { UpdateServiceForm } from "./form";
import { cookies } from "next/headers";

export default async function ServicePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const jwt = cookies().get("jwt");

  const service = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  ).then((res) => res.json() as Promise<Service>);

  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Atualizar serviço</h1>
      <UpdateServiceForm service={service} />
    </div>
  );
}

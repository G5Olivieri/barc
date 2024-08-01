import { fetchServices } from "@/service";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Services() {
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
    <main className="px-4 pt-2 flex flex-col gap-4 pb-[94px]">
      <div className="fixed left-0 bottom-0 w-screen h-[70px] bg-white p-4">
        <Link
          className="block text-center w-full btn-primary"
          href="/admin/services/new"
        >
          Adicionar serviço
        </Link>
      </div>
      <h1 className="text-2xl">Serviços</h1>
      <ul className="flex flex-col gap-1">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              className="block w-full border border-zinc-400 rounded py-3 px-2 hover:bg-zinc-100"
              href={`/admin/services/${service.id}`}
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { Service } from "@/app/types";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Services() {
  const jwt = cookies().get("jwt");
  const services = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },

      cache: "no-cache",
    },
  ).then((res) => res.json() as Promise<Service[]>);

  return (
    <main>
      <h1>Serviços</h1>
      <Link href="/admin/services/new">Novo serviço</Link>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <Link href={`/admin/services/${service.id}`}>{service.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

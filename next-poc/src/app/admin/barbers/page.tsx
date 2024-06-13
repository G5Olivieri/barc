import { Barber } from "@/app/types";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Barbeiros() {
  const jwt = cookies().get("jwt");
  const barbers = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-cache",
    },
  ).then((res) => res.json() as Promise<Barber[]>);
  return (
    <main>
      <h1>Barbeiros</h1>
      <Link href="/admin/barbers/new">Novo barbeiro</Link>
      <ul>
        {barbers.map((barber) => (
          <li key={barber.id}>
            <Link href={`/admin/barbers/${barber.id}`}>{barber.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

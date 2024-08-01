import { fetchBarbers } from "@/barber";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Barbers() {
  const jwt = cookies().get("jwt");
  if (!jwt) {
    return "Unauthorized";
  }
  const barbers = await fetchBarbers({
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
    cache: "no-cache",
  });
  return (
    <main className="px-4 pt-2 flex flex-col gap-4 pb-[94px]">
      <div className="fixed left-0 bottom-0 w-screen h-[70px] bg-white p-4">
        <Link
          className="block text-center w-full btn-primary"
          href="/admin/barbers/new"
        >
          Adicionar barbeiro(a)
        </Link>
      </div>
      <h1 className="text-2xl">Barbeiros</h1>
      <ul className="flex flex-col gap-1">
        {barbers.map((barber) => (
          <li key={barber.id}>
            <Link
              className="block w-full border border-zinc-400 rounded py-3 px-2 hover:bg-zinc-100"
              href={`/admin/barbers/${barber.id}`}
            >
              {barber.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

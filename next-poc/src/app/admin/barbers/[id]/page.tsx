import { Barber } from "@/app/types";

export default async function BarberPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const barber = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers/${id}`,
  ).then((res) => res.json() as Promise<Barber>);
  return (
    <main>
      <h1>{barber.name}</h1>
    </main>
  );
}

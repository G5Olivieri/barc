import { Service } from "@/app/types";

export default async function ServicePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const service = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${id}`,
  ).then((res) => res.json() as Promise<Service>);
  return (
    <main>
      <h1>{service.name}</h1>
    </main>
  );
}

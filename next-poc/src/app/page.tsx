import HomeComponent from "./home-component";
import { Barber, Service } from "./types";

export default async function Home() {
  const barbers = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers`,
    {
      cache: "no-cache",
    },
  ).then((res) => res.json() as Promise<Barber[]>);
  return <HomeComponent barbers={barbers} />;
}

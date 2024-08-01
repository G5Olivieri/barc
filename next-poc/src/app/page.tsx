import { fetchBarbers } from "../barber";
import Booking from "./booking";

export default async function Home() {
  return <Booking barbers={await fetchBarbers({ cache: "no-cache" })} />;
}

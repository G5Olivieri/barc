import { fetchBarberById } from "@/barber";
import ConfirmComponent from "./confirm-component";
import { UUID } from "crypto";
import { fetchServiceById } from "@/service";

export default async function Confirm({
  searchParams: { barber: barberId, service: serviceId, time, date },
}: {
  searchParams: {
    barber: UUID;
    service: UUID;
    time: string;
    date: string;
  };
}) {
  const barber = await fetchBarberById(barberId);
  const service = await fetchServiceById(serviceId);

  return (
    <ConfirmComponent
      service={service}
      barber={barber}
      time={time}
      date={date}
    />
  );
}

import ConfirmComponent from "./confirm-component";

export default async function Confirm({
  searchParams: { barber: barberId, service: serviceId, time, date },
}: {
  searchParams: {
    barber: string;
    service: string;
    time: string;
    date: string;
  };
}) {
  const barber = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers/${barberId}`,
  ).then((res) => res.json());
  const service = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${serviceId}`,
  ).then((res) => res.json());
  return (
    <ConfirmComponent
      service={service}
      barber={barber}
      time={time}
      date={date}
    />
  );
}

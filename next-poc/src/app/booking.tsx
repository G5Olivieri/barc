"use client";
import { minusMinutes, Time, timeToDate, timeToString } from "@/time";
import { formatDate, isAfter, isBefore, isToday, startOfToday } from "date-fns";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { Barber, fetchAvailabilities } from "../barber";
import { Nullable } from "../nullable";
import { Service } from "../service";
import { DatePicker } from "./components/datepicker";

export default function Booking({ barbers }: { barbers: Barber[] }) {
  const [barberSelect, setBarberSelect] = useState<Nullable<Barber>>(null);
  const [serviceSelect, setServiceSelect] = useState<Nullable<Service>>(null);
  const [dateInput, setDateInput] = useState<Nullable<Date>>(null);
  const [timeButtons, setTimeButtons] = useState<string[]>([]);

  const onBarberSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setServiceSelect(null);
    setDateInput(null);
    setBarberSelect(() => {
      const barberId = e.target.value;
      return barbers.find((barber) => barber.id === barberId) || null;
    });
  };

  const onServiceSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateInput(null);
    setServiceSelect(() => {
      const serviceId = e.target.value;
      return (
        barberSelect?.services.find((service) => service.id === serviceId) ||
        null
      );
    });
  };

  const onDateInputChange = async (date: Date) => {
    setTimeButtons([]);
    setDateInput(date);

    const availabilities = await fetchAvailabilities(
      barberSelect!,
      serviceSelect!.duration,
      date,
    );
    setTimeButtons(availabilities.map(timeToString));
  };

  const filterDate = (date: Date) => {
    if (isBefore(date, startOfToday())) {
      return false;
    }
    const day = date.getDay();
    if (!(barberSelect?.availableDays.includes(day) || false)) {
      return false;
    }
    const endOfOfficeDay = barberSelect?.endOffice;
    if (isToday(date) && endOfOfficeDay) {
      return isAfter(
        timeToDate(
          minusMinutes(endOfOfficeDay, serviceSelect?.duration || 30),
          date,
        ),
        new Date(),
      );
    }
    return true;
  };

  return (
    <main className="flex flex-col py-10 px-4 gap-6">
      <h1 className="text-2xl">Agendar</h1>
      <div className="flex flex-col gap-2">
        <div className="form-group">
          <label htmlFor="barber-select">Barbeiro</label>
          <select
            className="form-control w-full"
            name="barber"
            id="barber-select"
            value={barberSelect?.id || ""}
            onChange={onBarberSelectChange}
            required
          >
            <option value="">Selecionar barbeiro</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="service-select">Serviço</label>
          <select
            className="form-control w-full"
            name="service"
            id="service-select"
            value={serviceSelect?.id || ""}
            onChange={onServiceSelectChange}
            disabled={!barberSelect}
            required
          >
            <option value="">Selecionar serviço</option>
            {barberSelect &&
              barberSelect.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date-input">Data</label>
          <DatePicker
            className="form-control w-full"
            name="date"
            id="date-input"
            value={dateInput}
            placeholder="Selecionar data"
            onChange={onDateInputChange}
            disabled={!(barberSelect && serviceSelect)}
            filterDate={filterDate}
            required
          />
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        {barberSelect &&
          serviceSelect &&
          dateInput &&
          timeButtons.map((time) => (
            <Link
              href={`/confirm?barber=${barberSelect.id}&service=${serviceSelect.id}&date=${formatDate(dateInput, "yyyy-MM-dd")}&time=${time}`}
              className="btn-primary"
              key={time}
            >
              {time}
            </Link>
          ))}
      </div>
    </main>
  );
}

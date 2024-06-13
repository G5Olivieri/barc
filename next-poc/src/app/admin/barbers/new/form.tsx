"use client";
import React from "react";
import { WeekdaysInput } from "./weekdays-input";
import { useForm } from "react-hook-form";
import { Service } from "@/app/types";
import Select from "react-select";
import { Time } from "@/time";
import { TimeRange } from "@/time-range";

type InputData = {
  name: string;
  service: string;
  officehoursStart: string;
  officehoursEnd: string;
  lunchTimeStart: string;
  lunchTimeEnd: string;
};

type NewBarberFormProps = {
  services: Service[];
};
export const NewBarberForm: React.FC<NewBarberFormProps> = ({ services }) => {
  const { register, handleSubmit } = useForm<InputData>();
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [selectedServices, setSelectedServices] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [officeHourStart, setOfficeHourStart] = React.useState<Time>(
    new Time(9, 0),
  );
  const [officeHourEnd, setOfficeHourEnd] = React.useState<Time>(
    new Time(18, 0),
  );
  const [lunchTimeStart, setLunchTimeStart] = React.useState<Time>(
    new Time(12, 0),
  );
  const [lunchTimeEnd, setLunchTimeEnd] = React.useState<Time>(new Time(13, 0));
  const dayTimeRange = new TimeRange(new Time(0, 0), new Time(23, 59));

  const onSubmit = handleSubmit(async (data) => {
    const officehours = [
      {
        start: { hour: officeHourStart.hour, minute: officeHourStart.minute },
        end: { hour: lunchTimeStart.hour, minute: lunchTimeStart.minute },
      },
      {
        start: { hour: lunchTimeEnd.hour, minute: lunchTimeEnd.minute },
        end: { hour: officeHourEnd.hour, minute: officeHourEnd.minute },
      },
    ];
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/barbers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("jwt="))
            ?.split("=")[1]
        }`,
      },
      body: JSON.stringify({
        name: data.name,
        officehours,
        weekdays: selectedDays.sort((a, b) => a - b),
        services: selectedServices.map((s) => s.value),
      }),
    });
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = "/admin/barbers";
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name-input">Nome</label>
        <input
          className="form-control"
          type="text"
          id="name-input"
          {...register("name", { required: true })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="services-input">Serviços</label>
        <Select
          placeholder="Selecionar serviços"
          noOptionsMessage={() => "Sem opções"}
          isMulti
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "black",
              neutral20: "#18181b",
              neutral30: "#27272a",
            },
          })}
          classNames={{
            control: () => "form-control",
          }}
          onChange={(selected) =>
            setSelectedServices(selected as { value: string; label: string }[])
          }
          options={services.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
        />
      </div>
      <WeekdaysInput
        selectedDays={selectedDays}
        onSelect={(days) => setSelectedDays(days)}
      />
      <div className="form-group">
        <label htmlFor="officehours-start-input">Inicio do expediente</label>
        <select
          className="form-control"
          id="officehours-start-input"
          value={officeHourStart.toString()}
          onChange={(e) => {
            const t = Time.fromString(e.target.value);
            setOfficeHourStart(t);
            if (t.isAfter(officeHourEnd)) setOfficeHourEnd(t.addMinutes(60));
            if (t.isAfter(lunchTimeStart)) setLunchTimeStart(t.clone());
            if (t.isAfter(lunchTimeEnd)) setLunchTimeEnd(t.addMinutes(60));
          }}
        >
          {dayTimeRange
            .spread(60)
            .filter((_, i) => i < 23)
            .map((hour) => (
              <option key={hour.toString()} value={hour.toString()}>
                {hour.toString()}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="officehours-end-input">Fim do expediente</label>
        <select
          className="form-control"
          id="officehours-end-input"
          value={officeHourEnd.toString()}
          onChange={(e) => {
            setOfficeHourEnd(Time.fromString(e.target.value));
          }}
        >
          {dayTimeRange
            .spread(60)
            .filter((t) => t.isAfter(officeHourStart))
            .map((hour) => (
              <option key={hour.toString()} value={hour.toString()}>
                {hour.toString()}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="lunch-time-start-input">
          Inicio da pausa do almoço
        </label>
        <select
          className="form-control"
          id="lunch-time-start-input"
          value={lunchTimeStart.toString()}
          onChange={(e) => {
            const t = Time.fromString(e.target.value);
            setLunchTimeStart(t);
            if (t.isAfter(lunchTimeEnd)) setLunchTimeEnd(t.addMinutes(60));
          }}
        >
          {dayTimeRange
            .spread(60)
            .filter(
              (t) =>
                (t.equals(officeHourStart) || t.isAfter(officeHourStart)) &&
                t.isBefore(officeHourEnd),
            )
            .map((hour) => (
              <option key={hour.toString()} value={hour.toString()}>
                {hour.toString()}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="lunch-time-end-input">Fim da pausa do almoço</label>
        <select
          className="form-control"
          id="lunch-time-end-input"
          value={lunchTimeEnd.toString()}
          onChange={(e) => {
            setLunchTimeEnd(Time.fromString(e.target.value));
          }}
        >
          {dayTimeRange
            .spread(60)
            .filter(
              (t) =>
                t.isAfter(officeHourStart) &&
                (t.isBefore(officeHourEnd) || t.equals(officeHourEnd)),
            )
            .map((hour) => (
              <option key={hour.toString()} value={hour.toString()}>
                {hour.toString()}
              </option>
            ))}
        </select>
      </div>
      <button className="btn-primary" type="submit">
        Criar
      </button>
    </form>
  );
};

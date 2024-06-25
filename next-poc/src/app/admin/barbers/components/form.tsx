"use client";
import React from "react";
import { WeekdaysInput } from "./weekdays-input";
import { useForm } from "react-hook-form";
import { Service } from "@/app/types";
import Select from "react-select";
import { Time } from "@/time";
import { TimeRange } from "@/time-range";

type SelectedService = { value: string; label: string };
type SelectedDay = number;

export type InputData = {
  name: string;
  selectedDays: SelectedDay[];
  selectedServices: SelectedService[];
  officehoursStart: Time;
  officehoursEnd: Time;
  lunchTimeStart: Time;
  lunchTimeEnd: Time;
};

type BarberFormProps = {
  services: Service[];
  submitMessage: string;
  onSubmit: (data: InputData & {}) => void;
  defaultValues?: Partial<InputData>;
};
export const BarberForm: React.FC<BarberFormProps> = ({
  services,
  defaultValues,
  submitMessage,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm<InputData>({
    defaultValues: { name: defaultValues?.name },
  });
  const [selectedDays, setSelectedDays] = React.useState<SelectedDay[]>(
    defaultValues?.selectedDays ?? [],
  );
  const [selectedServices, setSelectedServices] = React.useState<
    SelectedService[]
  >(defaultValues?.selectedServices ?? []);
  const [officehoursStart, setOfficehoursStart] = React.useState<Time>(
    defaultValues?.officehoursStart ?? new Time(9, 0),
  );
  const [officehoursEnd, setOfficehoursEnd] = React.useState<Time>(
    defaultValues?.officehoursEnd ?? new Time(18, 0),
  );
  const [lunchTimeStart, setLunchTimeStart] = React.useState<Time>(
    defaultValues?.lunchTimeStart ?? new Time(12, 0),
  );
  const [lunchTimeEnd, setLunchTimeEnd] = React.useState<Time>(
    defaultValues?.lunchTimeEnd ?? new Time(13, 0),
  );
  const dayTimeRange = new TimeRange(new Time(0, 0), new Time(23, 59));

  const onSubmitInternal = handleSubmit(async (data) => {
    onSubmit({
      ...data,
      selectedDays,
      selectedServices,
      officehoursStart,
      officehoursEnd,
      lunchTimeStart,
      lunchTimeEnd,
    });
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmitInternal}>
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
          defaultValue={defaultValues?.selectedServices}
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
          value={officehoursStart.toString()}
          onChange={(e) => {
            const t = Time.fromString(e.target.value);
            setOfficehoursStart(t);
            if (t.isAfter(officehoursEnd)) setOfficehoursEnd(t.addMinutes(60));
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
          value={officehoursEnd.toString()}
          onChange={(e) => {
            setOfficehoursEnd(Time.fromString(e.target.value));
          }}
        >
          {dayTimeRange
            .spread(60)
            .filter((t) => t.isAfter(officehoursStart))
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
                (t.equals(officehoursStart) || t.isAfter(officehoursStart)) &&
                t.isBefore(officehoursEnd),
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
                t.isAfter(officehoursStart) &&
                (t.isBefore(officehoursEnd) || t.equals(officehoursEnd)),
            )
            .map((hour) => (
              <option key={hour.toString()} value={hour.toString()}>
                {hour.toString()}
              </option>
            ))}
        </select>
      </div>
      <button className="btn-primary" type="submit">
        {submitMessage}
      </button>
    </form>
  );
};

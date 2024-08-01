"use client";
import React from "react";
import { WeekdaysInput } from "./weekdays-input";
import { useForm } from "react-hook-form";
import Select from "react-select";
import {
  buildTimeFromString,
  equals,
  isAfter,
  isBefore,
  newTime,
  Time,
  addMinutes,
  timeToString,
} from "@/time";
import { newTimeRange, spread } from "@/time-range";
import { Service } from "@/service";

export type InputData = {
  name: string;
  weekdays: number[];
  services: Service[];
  startOffice: Time;
  endOffice: Time;
  startLunch: Time;
  endLunch: Time;
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
  const [weekdays, setWeekdays] = React.useState<number[]>(
    defaultValues?.weekdays ?? [],
  );
  const [selectedServices, setSelectedServices] = React.useState<Service[]>(
    defaultValues?.services ?? [],
  );
  const [startOffice, setOfficehoursStart] = React.useState<Time>(
    defaultValues?.startOffice ?? newTime(9, 0),
  );
  const [endOffice, setOfficehoursEnd] = React.useState<Time>(
    defaultValues?.endOffice ?? newTime(18, 0),
  );
  const [startLunch, setStartLunch] = React.useState<Time>(
    defaultValues?.startLunch ?? newTime(12, 0),
  );
  const [endLunch, setEndLunch] = React.useState<Time>(
    defaultValues?.endLunch ?? newTime(13, 0),
  );
  const dayTimeRange = newTimeRange(newTime(0, 0), newTime(23, 59));

  const onSubmitInternal = handleSubmit(async (data) => {
    onSubmit({
      ...data,
      weekdays,
      services: selectedServices,
      startOffice,
      endOffice,
      startLunch,
      endLunch,
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
            setSelectedServices(
              services.filter(
                (service) =>
                  selected.find((s) => s.value === service.id) !== undefined,
              ),
            )
          }
          options={services.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
          defaultValue={defaultValues?.services?.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
        />
      </div>
      <WeekdaysInput
        selectedDays={weekdays}
        onChange={(days) => setWeekdays(days)}
      />
      <div className="form-group">
        <label htmlFor="start-officehour-input">Inicio do expediente</label>
        <select
          className="form-control"
          id="start-officehour-input"
          value={timeToString(startOffice)}
          onChange={(e) => {
            const t = buildTimeFromString(e.target.value);
            setOfficehoursStart(t);
            if (isAfter(t, endOffice)) setOfficehoursEnd(addMinutes(t, 60));
            if (isAfter(t, startLunch)) setStartLunch(t);
            if (isAfter(t, endLunch)) setEndLunch(addMinutes(t, 60));
          }}
        >
          {spread(dayTimeRange, 60)
            .filter((_, i) => i < 23)
            .map((hour) => (
              <option key={timeToString(hour)} value={timeToString(hour)}>
                {timeToString(hour)}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="officehour-end-input">Fim do expediente</label>
        <select
          className="form-control"
          id="officehour-end-input"
          value={timeToString(endOffice)}
          onChange={(e) => {
            setOfficehoursEnd(buildTimeFromString(e.target.value));
          }}
        >
          {spread(dayTimeRange, 60)
            .filter((t) => isAfter(t, startOffice))
            .map((hour) => (
              <option key={timeToString(hour)} value={timeToString(hour)}>
                {timeToString(hour)}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="start-lunch-input">Inicio da pausa do almoço</label>
        <select
          className="form-control"
          id="start-lunch-input"
          value={timeToString(startLunch)}
          onChange={(e) => {
            const t = buildTimeFromString(e.target.value);
            setStartLunch(t);
            if (isAfter(t, endLunch)) setEndLunch(addMinutes(t, 60));
          }}
        >
          {spread(dayTimeRange, 60)
            .filter(
              (t) =>
                (equals(t, startOffice) || isAfter(t, startOffice)) &&
                isBefore(t, endOffice),
            )
            .map((hour) => (
              <option key={timeToString(hour)} value={timeToString(hour)}>
                {timeToString(hour)}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="end-lunch-input">Fim da pausa do almoço</label>
        <select
          className="form-control"
          id="end-lunch-input"
          value={timeToString(endLunch)}
          onChange={(e) => {
            setEndLunch(buildTimeFromString(e.target.value));
          }}
        >
          {spread(dayTimeRange, 60)
            .filter(
              (t) =>
                isAfter(t, startOffice) &&
                (isBefore(t, endOffice) || equals(t, endOffice)),
            )
            .map((hour) => (
              <option key={timeToString(hour)} value={timeToString(hour)}>
                {timeToString(hour)}
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

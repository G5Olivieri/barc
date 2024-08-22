"use client";
import React, { useState } from "react";

enum Weekdays {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

const WEEKDAYS_LABELS = [
  { label: "Dom", value: 1 },
  { label: "Seg", value: 2 },
  { label: "Ter", value: 3 },
  { label: "Qua", value: 4 },
  { label: "Qui", value: 5 },
  { label: "Sex", value: 6 },
  { label: "Sab", value: 7 },
];

type WeekdaysInputProps = {
  selectedDays: number[];
  onChange: (selectedDays: number[]) => void;
};

export const WeekdaysInput: React.FC<WeekdaysInputProps> = ({
  selectedDays,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="weekdays-input">Dias de trabalho</label>
      <div className="flex flex-wrap gap-1">
        {WEEKDAYS_LABELS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() =>
              onChange(
                selectedDays.includes(value)
                  ? selectedDays.filter((day) => day !== value)
                  : [...selectedDays, value],
              )
            }
            type="button"
            className={`border border-black py-2 px-3 rounded ${selectedDays.includes(value) ? "bg-black text-white hover:bg-zinc-800 active:bg-zinc-700" : "bg-white hover:bg-zinc-200 active:bg-zinc-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

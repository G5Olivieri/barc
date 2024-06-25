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

const WEEKDAYS_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

type WeekdaysInputProps = {
  selectedDays: number[];
  onSelect: (selectedDays: number[]) => void;
};

export const WeekdaysInput: React.FC<WeekdaysInputProps> = ({
  selectedDays,
  onSelect
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="weekdays-input">Dias de trabalho</label>
      <div className="flex flex-wrap gap-1">
        {WEEKDAYS_LABELS.map((label, idx) => (
          <button
            key={idx}
            onClick={() =>
              onSelect(selectedDays.includes(idx) ? selectedDays.filter((day) => day !== idx) : [...selectedDays, idx])
            }
            type="button"
            className={`border border-black py-2 px-3 rounded ${selectedDays.includes(idx) ? "bg-black text-white hover:bg-zinc-800 active:bg-zinc-700" : "bg-white hover:bg-zinc-200 active:bg-zinc-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

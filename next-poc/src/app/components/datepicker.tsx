"use client";
import {
  addDays,
  addMonths,
  formatDate,
  getDay,
  isSameMonth,
  set,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useRef } from "react";

type DatePickerGridCellProps = {
  date: Date;
  onClick?: (date: Date) => void;
  className?: string;
  disabled?: boolean;
};

const DatePickerGridCell: React.FC<DatePickerGridCellProps> = ({
  date,
  onClick,
  className,
  disabled,
}) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={() => {
        onClick && onClick(date);
      }}
    >
      {formatDate(date, "dd")}
    </button>
  );
};
type DatePickerGridProps = {
  month: Date;
  onClick: (date: Date) => void;
  filterDate?: (date: Date) => boolean;
};
const DatePickerGrid: React.FC<DatePickerGridProps> = ({
  month,
  onClick,
  filterDate,
}) => {
  const firstDateOfMonth = startOfMonth(month);
  const firstDayOfWeekOfMonth = getDay(firstDateOfMonth);
  const firstCellDate = subDays(firstDateOfMonth, firstDayOfWeekOfMonth);
  const dates = [];
  for (let i = 0; i < 42; i++) {
    dates.push(addDays(firstCellDate, i));
  }
  return (
    <div className="grid grid-cols-7 grid-rows-7">
      <span className="flex items-center justify-center font-bold">D</span>
      <span className="flex items-center justify-center font-bold">S</span>
      <span className="flex items-center justify-center font-bold">T</span>
      <span className="flex items-center justify-center font-bold">Q</span>
      <span className="flex items-center justify-center font-bold">Q</span>
      <span className="flex items-center justify-center font-bold">S</span>
      <span className="flex items-center justify-center font-bold">S</span>
      {dates.map((date) => (
        <DatePickerGridCell
          disabled={!(filterDate && filterDate(date))}
          className={`p-2 text-black hover:bg-zinc-300 ${isSameMonth(date, month) ? "" : "text-gray-400 hover:text-black"} disabled:text-gray-400 disabled:hover:bg-white`}
          key={date.toISOString()}
          date={date}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

type DatePickerMonthSelectorProps = {
  month: Date;
  onChange: (date: Date) => void;
};
const DatePickerMonthSelector: React.FC<DatePickerMonthSelectorProps> = ({
  month,
  onChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <button
        type="button"
        className="py-2 px-4"
        onClick={() => onChange(subMonths(month, 1))}
      >
        <span>&lt;</span>
        <span className="sr-only">ir para mês anterior</span>
      </button>
      <span>
        {formatDate(month, "MMMM", {
          locale: ptBR,
        })}{" "}
        {formatDate(month, "yyyy", {
          locale: ptBR,
        })}
      </span>
      <button
        type="button"
        className="py-2 px-4"
        onClick={() => onChange(addMonths(month, 1))}
      >
        <span>&gt;</span>
        <span className="sr-only">ir para mês posterior</span>
      </button>
    </div>
  );
};

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  className?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  filterDate?: (date: Date) => boolean;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  id,
  name,
  className,
  required,
  disabled,
  placeholder,
  filterDate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const [month, setMonth] = React.useState(value);
  const selectedDate = value
    ? formatDate(value, "P", {
        locale: ptBR,
      })
    : "";

  const onOutsideClick = (e: MouseEvent) => {
    if (!ref.current) return;
    if (!ref.current.contains(e.target as Node)) {
      setShowPicker(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", onOutsideClick);
    return () => {
      document.removeEventListener("click", onOutsideClick);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setShowPicker(false);
        }
      }}
    >
      <input
        type="text"
        id={id}
        name={name}
        onClick={() => setShowPicker(!showPicker)}
        onChange={() => {}}
        value={selectedDate}
        required={required}
        className={className}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            setShowPicker(!showPicker);
          }
          if (e.key === "ArrowDown") {
            setShowPicker(true);
          }
          if (e.key === "Escape") {
            setShowPicker(false);
          }
        }}
      />
      {showPicker && (
        <div
          aria-hidden={showPicker}
          aria-label={placeholder}
          role="dialog"
          className="absolute border border-zinc-900 rounded z-10 bg-white"
        >
          <DatePickerMonthSelector
            month={month || new Date()}
            onChange={(date) => setMonth(date)}
          />
          <DatePickerGrid
            month={month || new Date()}
            filterDate={filterDate}
            onClick={(date: Date) => {
              onChange(date);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

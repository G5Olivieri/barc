"use client";
import React, { useState } from "react";

function removeZeroEsquerda(str: string): string {
  let i;
  for (i = 0; str.charAt(i) === "0" && i < str.length; i++);
  if (i === str.length) return "";

  return str.substring(i, str.length);
}
type PriceInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  thousandsSeparator?: string;
  decimalSeparator?: string;
};

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  className,
  id,
  disabled,
  required,
  thousandsSeparator = ".",
  decimalSeparator = ",",
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Tab" ||
      event.key === "Enter" ||
      event.key === "Shift" ||
      event.key === "Control" ||
      event.key === "Alt" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Escape"
    )
      return;
    if (event.key === "Backspace") {
      let control = removeZeroEsquerda(
        value
          .replaceAll(thousandsSeparator, "")
          .replaceAll(decimalSeparator, ""),
      );
      control = control.substring(0, control.length - 1);
      let tmpValue = "";
      // TODO: variable decimal size
      if (control.length === 0) {
        tmpValue = `0${decimalSeparator}00`;
      } else if (control.length === 1) {
        tmpValue = `0${decimalSeparator}0${control}`;
      } else if (control.length === 2) {
        tmpValue = `0${decimalSeparator}${control}`;
      } else if (control.length === 3) {
        tmpValue = `${control[0]}${decimalSeparator}${control[1]}${control[2]}`;
      } else {
        let inteiros = control.substring(0, control.length - 2);
        const decimais = control.substring(control.length - 2, control.length);
        inteiros = inteiros
          .split("")
          .reverse()
          .reduce((a, c, i) =>
            (i + 1) % 3 === 0 ? a + c + thousandsSeparator : a + c,
          )
          .split("")
          .reverse()
          .join("");
        if (inteiros[0] === thousandsSeparator) {
          inteiros = inteiros.substring(1, inteiros.length);
        }
        tmpValue = `${inteiros}${decimalSeparator}${decimais}`;
      }
      onChange(tmpValue);
      event.preventDefault();
      return;
    }

    if (!"01234567789".includes(event.key)) {
      event.preventDefault();
      return;
    }

    const control = removeZeroEsquerda(
      value
        .replaceAll(thousandsSeparator, "")
        .replaceAll(decimalSeparator, "") + event.key,
    );
    let tmpValue = "";

    if (control.length === 1) {
      tmpValue = `0,0${control}`;
    } else if (control.length === 2) {
      tmpValue = `0,${control}`;
    } else if (control.length === 3) {
      tmpValue = `${control[0]},${control[1]}${control[2]}`;
    } else {
      tmpValue = control
        .split("")
        .reverse()
        .map((c, i) =>
          i === 2
            ? c + decimalSeparator
            : (i + 1) % 3 === 0
              ? c + thousandsSeparator
              : c,
        )
        .reverse()
        .join("");
    }
    onChange(tmpValue);
    event.preventDefault();
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      id={id}
      disabled={disabled}
      value={value}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      required={required}
    />
  );
};

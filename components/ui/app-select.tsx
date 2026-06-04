"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EMPTY_VALUE = "__empty__";

type SelectOption = {
  value: string;
  label: string;
};

type AppSelectProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

function normalizeValue(value: string | undefined) {
  return value ? value : EMPTY_VALUE;
}

function denormalizeValue(value: string) {
  return value === EMPTY_VALUE ? "" : value;
}

export function AppSelect({
  name,
  value,
  defaultValue = "",
  placeholder,
  options,
  onValueChange,
  className,
  disabled,
}: AppSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;


  function handleValueChange(nextValue: string) {
    const actualValue = denormalizeValue(nextValue);
    if (!isControlled) setInternalValue(actualValue);
    onValueChange?.(actualValue);
  }

  return (
    <div className={cn("w-full", className)}>
      {name ? <input type="hidden" name={name} value={currentValue ?? ""} /> : null}
      <Select value={normalizeValue(currentValue)} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

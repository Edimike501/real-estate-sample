import { useEffect, useState } from "react";

/**
 * Hook that debounces a value by delaying updates until after a specified delay.
 * Only updates the debounced value if the input length is > 1 or empty.
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Rule: only update if characters typed is more than 1, or if it's empty (to reset search)
    if (typeof value === "string") {
      if (value.length === 1) {
        return;
      }
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

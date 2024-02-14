import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, startValue: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
      setTimeout(() => {
        setDebouncedValue(startValue);
      }, delay ?? 500);
    };
  }, [value, delay]);

  return debouncedValue;
}

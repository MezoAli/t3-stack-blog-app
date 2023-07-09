import { useEffect, useState } from "react";

export function useDebounce(name: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(name);
    }, delay);

    return () => clearTimeout(id);
  }, [name, delay]);

  return debounceValue;
}

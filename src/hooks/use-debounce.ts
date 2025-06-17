import { useState, useEffect } from 'react';

/**
 * Hook untuk melakukan debounce pada nilai input
 * @param value Nilai yang akan di-debounce
 * @param delay Waktu delay dalam milidetik
 * @returns Nilai yang sudah di-debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Atur timer untuk update nilai setelah delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer jika nilai berubah sebelum delay selesai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 
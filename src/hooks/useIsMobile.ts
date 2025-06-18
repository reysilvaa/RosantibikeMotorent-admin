import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Cek ukuran layar saat komponen dimuat
    checkIsMobile();
    setIsReady(true);
    
    // Tambahkan event listener untuk perubahan ukuran layar
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup event listener saat komponen unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return { isMobile, isReady };
} 
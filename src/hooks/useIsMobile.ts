import { useState, useEffect } from 'react';

interface IsMobileResult {
  isMobile: boolean;
  isTablet: boolean;
  isSmallMobile: boolean;
  isReady: boolean;
}

export function useIsMobile(mobileBreakpoint = 768, tabletBreakpoint = 1024, smallMobileBreakpoint = 480): IsMobileResult {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < mobileBreakpoint);
      setIsTablet(width >= mobileBreakpoint && width < tabletBreakpoint);
      setIsSmallMobile(width < smallMobileBreakpoint);
    };
    
    // Cek ukuran layar saat komponen dimuat
    checkDeviceSize();
    setIsReady(true);
    
    // Tambahkan event listener untuk perubahan ukuran layar
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, [mobileBreakpoint, tabletBreakpoint, smallMobileBreakpoint]);

  return { isMobile, isTablet, isSmallMobile, isReady };
} 
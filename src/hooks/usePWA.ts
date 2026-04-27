'use client';

import { useState, useEffect } from 'react';

/**
 * Detects whether the app is running in PWA standalone mode.
 * Uses display-mode: standalone media query + iOS navigator.standalone.
 */
export function usePWA() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check iOS standalone
    const isIosStandalone = (window.navigator as any).standalone === true;

    // Check display-mode: standalone (Chrome, Edge, etc.)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    setIsStandalone(mediaQuery.matches || isIosStandalone);

    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches || isIosStandalone);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return { isStandalone };
}

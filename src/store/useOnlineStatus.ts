/**
 * Online / Offline Status Hook & Helper
 * Tracks browser/desktop connectivity so core learning features stay 100% offline-capable
 * and optional online actions fail gracefully with clear user messaging.
 */

import { useEffect, useState } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  isOffline: boolean;
  lastChangedAt: string;
}

export function getOnlineStatus(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') {
    return true;
  }
  return navigator.onLine;
}

export function useOnlineStatus(): OnlineStatusState {
  const [isOnline, setIsOnline] = useState<boolean>(() => getOnlineStatus());
  const [lastChangedAt, setLastChangedAt] = useState<string>(() => new Date().toISOString());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChangedAt(new Date().toISOString());
    };
    const handleOffline = () => {
      setIsOnline(false);
      setLastChangedAt(new Date().toISOString());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    lastChangedAt,
  };
}

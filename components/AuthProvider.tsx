'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser   = useAuth(state => state.fetchUser);
  const initialized = useAuth(state => state.initialized);
  const pathname    = usePathname();

  useEffect(() => {
    // Run on first mount AND after login/logout navigations
    // initialized resets to false after logout, so this re-fetches correctly
    if (!initialized) {
      fetchUser();
    }
  }, [pathname, initialized, fetchUser]);

  return <>{children}</>;
}
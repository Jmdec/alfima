'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser   = useAuth(state => state.fetchUser);
  const initialized = useAuth(state => state.initialized);
  const pathname    = usePathname();

  useEffect(() => {
    if (!initialized) {
      fetchUser();
    }
  }, [pathname, initialized, fetchUser]);

  return <>{children}</>;
}
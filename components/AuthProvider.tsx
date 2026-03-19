'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser   = useAuth(state => state.fetchUser);
  const initialized = useAuth(state => state.initialized);

  useEffect(() => {
    fetchUser();
  }, []); // ✅ empty deps — only runs once on app mount, not on every navigation

  if (!initialized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#ef4444',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
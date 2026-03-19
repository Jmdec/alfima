'use client';

import { create } from 'zustand';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'agent' | 'buyer';
  avatar: string | null;
  is_active: boolean;
  license_number: string | null;
  specialization: string | null;
  experience_years: number | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  fetchUser: async () => {
    // Skip if already initialized
    if (get().initialized) return;

    set({ loading: true });
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });

      console.log('[fetchUser] status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('[fetchUser] user:', data.user);
        set({ user: data.user, initialized: true });
      } else {
        console.warn('[fetchUser] not ok — clearing user');
        set({ user: null, initialized: true });
      }
    } catch (e) {
      console.error('[fetchUser] error:', e);
      set({ user: null, initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => {
    console.log('[setUser]', user);
    set({ user, initialized: true });
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    set({ user: null, initialized: true });
  },
}));

// ── Favorites ─────────────────────────────────────────────────────────────────
interface FavoritesState {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorited: (id: number) => boolean;
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (id) => {
    set(state => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter(f => f !== id)
        : [...state.favorites, id],
    }));
  },
  isFavorited: (id) => get().favorites.includes(id),
}));
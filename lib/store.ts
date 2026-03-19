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

// Prevent duplicate in-flight requests
let fetchPromise: Promise<void> | null = null;

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  fetchUser: async () => {
    // If a fetch is already in-flight, reuse it
    if (fetchPromise) return fetchPromise;

    // If already loading, skip
    if (get().loading) return;

    set({ loading: true });

    fetchPromise = (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          set({ user: data.user, initialized: true, loading: false });
        } else {
          set({ user: null, initialized: true, loading: false });
        }
      } catch (e) {
        console.error('[fetchUser] error:', e);
        set({ user: null, initialized: true, loading: false });
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  },

  setUser: (user) => {
    set({ user, initialized: true, loading: false });
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    fetchPromise = null;
    set({ user: null, initialized: false, loading: false });
  },
}));

// Favorites
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
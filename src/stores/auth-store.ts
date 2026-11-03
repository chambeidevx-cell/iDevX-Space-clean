import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from '@/stores/user-store';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const VALID_EMAIL = 'johndoe@idevx.com';
const VALID_PASSWORD = '$Adrenaline101';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: async (email: string, password: string): Promise<boolean> => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
          const mockToken = btoa(`${email}:${Date.now()}`);
          set({ isAuthenticated: true, token: mockToken });
          useUserStore.getState().setUser({
            id: '1',
            uuid: 'c20e78d4-6d18-47de-95ec-2b4ab11455b2',
            firstName: 'John',
            lastName: 'Doe',
            email: VALID_EMAIL,
            roles: ['Administrator'],
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

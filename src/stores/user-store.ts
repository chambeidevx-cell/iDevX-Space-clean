import { create } from 'zustand';
import { User } from '@/interfaces/user';
import { formatPersonName } from '@/utils/format-name';
import { useNameFormatStore } from './name-format-store';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  getFullName: () => string;
  getInitials: () => string;
}

const DEFAULT_PLATFORMS = ['Client Portal', 'Admin Panel', 'Analytics'];

const getInitialUser = (): User => {
  const storedUser = localStorage.getItem('user-info');
  if (storedUser) {
    const parsed: User = JSON.parse(storedUser);
    return {
      ...parsed,
      platforms: parsed.platforms?.length ? parsed.platforms : DEFAULT_PLATFORMS,
    };
  }
  return {
    id: '1',
    uuid: 'c20e78d4-6d18-47de-95ec-2b4ab11455b2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@idevx.com',
    platforms: DEFAULT_PLATFORMS,
  };
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: getInitialUser(),
  setUser: (user: User) => {
    localStorage.setItem('user-info', JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem('user-info');
    set({ user: null });
  },
  getFullName: () => {
    const { user } = get();
    if (!user) {
      return '';
    }
    // Reads the store directly rather than a hook — this runs outside React.
    return formatPersonName(user, useNameFormatStore.getState().format);
  },
  getInitials: () => {
    const { user } = get();
    if (!user) {
      return '';
    }
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  },
}));

import { create } from 'zustand';

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type User = {
    id: number;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    createdAt: string;
    updatedAt: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user: User) => set({ user, isAuthenticated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));

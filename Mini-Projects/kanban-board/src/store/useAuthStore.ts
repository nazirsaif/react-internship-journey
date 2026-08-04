import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: { email: string } | null;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  login: async (email, password) => {
    // We will use the proper API client once built, using basic fetch for now
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    set({ accessToken: data.accessToken, user: { email } });
  },
  signup: async (data) => {
    const response = await fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Signup failed');
    const resData = await response.json();
    set({ accessToken: resData.accessToken, user: { email: data.email } });
  },
  logout: async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    set({ accessToken: null, user: null });
  },
}));

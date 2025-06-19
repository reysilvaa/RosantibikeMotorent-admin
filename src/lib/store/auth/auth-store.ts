import { create } from 'zustand';
import { loginAdmin } from '@/lib/auth';
import { isAuthenticated, removeToken } from '@/lib/cookies';
import Cookies from 'js-cookie';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  login: (username: string, password: string, redirect?: () => void) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? isAuthenticated() : false,
  
  login: async (username: string, password: string, redirect?: () => void) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await loginAdmin({ username, password });
      
      Cookies.set('accessToken', response.access_token, { expires: 7 });
          
      set({ isLoading: false, isAuthenticated: true });
      
      if (redirect) {
        setTimeout(() => {
          redirect();
        }, 100);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Username atau password salah';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },
  
  logout: () => {
    removeToken();
    set({ isAuthenticated: false });
  },
  
  checkAuth: () => {
    const authStatus = isAuthenticated();
    set({ isAuthenticated: authStatus });
    return authStatus;
  }
})); 
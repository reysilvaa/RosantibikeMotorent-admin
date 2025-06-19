import { create } from 'zustand';
import { login, logout } from '@/lib/api/auth';
import { isAuthenticated, removeAdminData, setAdminData } from '@/lib/cookies';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  adminData: { id: string; username: string; nama: string } | null;
  
  login: (username: string, password: string, redirect?: () => void) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? isAuthenticated() : false,
  adminData: null,
  
  login: async (username: string, password: string, redirect?: () => void) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await login({ username, password });
      
      setAdminData(response.admin);
          
      set({ 
        isLoading: false, 
        isAuthenticated: true,
        adminData: response.admin
      });
      
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
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      removeAdminData();
      set({ 
        isLoading: false, 
        isAuthenticated: false, 
        adminData: null 
      });
      
      window.location.href = '/auth/login';
    }
  },
  
  checkAuth: () => {
    const authStatus = isAuthenticated();
    set({ isAuthenticated: authStatus });
    return authStatus;
  }
})); 
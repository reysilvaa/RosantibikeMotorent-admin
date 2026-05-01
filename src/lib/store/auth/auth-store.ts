import { create } from 'zustand';
import axios from '../../axios';
import { getAdminData, removeAdminData, setAdminData } from '../../cookies';
import { toast } from '@/components/ui/use-toast';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  adminData: { id: string; username: string; nama: string } | null;

  login: (
    username: string,
    password: string,
    redirect?: () => void
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? !!getAdminData() : false,
  adminData: typeof window !== 'undefined' ? getAdminData() : null,

  login: async (username, password, redirect) => {
    set({ isLoading: true, error: null });

    try {
      console.log('Mencoba login dengan username:', username);
      
      const response = await axios.post('/auth/login', { username, password });
      console.log('Respons login:', response.data);
      
      // Periksa apakah login berhasil
      if (response.data && response.data.admin && response.data.authenticated) {
        // Simpan data admin dari respons server
        const adminData = response.data.admin;
        setAdminData(adminData);
        
        console.log('Login berhasil, data admin disimpan');
        
        set({
          isLoading: false,
          isAuthenticated: true,
          adminData: adminData,
        });

        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${adminData.nama}`,
          variant: 'default',
        });

        if (redirect) {
          console.log('Melakukan redirect ke dashboard');
          redirect();
        }
        
        return true;
      } else {
        console.error('Format respons tidak valid:', response.data);
        throw new Error('Format respons tidak valid');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Gagal login. Silakan coba lagi.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Username atau password salah';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        console.error('Request error:', error.request);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        adminData: null,
      });
      
      toast({
        title: 'Login Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await axios.post('/auth/logout');
      console.log('Logout berhasil');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Hapus data admin dari cookies dan localStorage
      removeAdminData();
      
      set({
        isLoading: false,
        isAuthenticated: false,
        adminData: null,
      });
      
      // Redirect ke halaman login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },

  checkAuth: () => {
    const adminData = getAdminData();
    const isAuthenticated = !!adminData;
    
    if (isAuthenticated !== get().isAuthenticated) {
      set({ isAuthenticated, adminData });
    }
    
    return isAuthenticated;
  },
}));

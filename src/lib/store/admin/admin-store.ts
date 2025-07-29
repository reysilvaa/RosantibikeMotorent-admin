import { create } from 'zustand';
import axios from '../../axios';
import { Admin } from '../../types/admin';
import { useAuthStore } from '../auth/auth-store';

interface AdminState {
  admins: Admin[];
  currentAdmin: Admin | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  searchQuery: string;
  showDialog: boolean;
  adminToDelete: string | null;

  fetchAdmins: () => Promise<void>;
  handleSearch: (query: string) => Promise<void>;
  resetSearch: () => Promise<void>;
  confirmDelete: (id: string) => void;
  cancelDelete: () => void;
  deleteAdmin: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearMessages: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  admins: [],
  currentAdmin: null,
  loading: false,
  error: null,
  success: null,
  searchQuery: '',
  showDialog: false,
  adminToDelete: null,

  fetchAdmins: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.get('/admin', {
        params: {
          search: get().searchQuery,
        },
      });
      
      // Get current logged in admin data
      const userData = useAuthStore.getState().adminData;
      let currentAdmin: Admin | null = null;
      
      const adminsData = response.data.data || response.data || [];

      if (userData) {
        // Find the current admin in the fetched admins list
        currentAdmin = adminsData.find((admin: Admin) => admin.id === userData.id) || null;

        // If not found, create a placeholder with minimal data
        if (!currentAdmin && userData.id) {
          currentAdmin = {
            id: userData.id,
            username: userData.username || '',
            nama: userData.nama || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }

      set({
        admins: adminsData,
        currentAdmin,
        loading: false,
      });
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      set({
        loading: false,
        error: error.response?.data?.message || 'Gagal mengambil data admin',
        admins: [],
      });
    }
  },

  handleSearch: async (query: string) => {
    set({ searchQuery: query });
    await get().fetchAdmins();
  },

  resetSearch: async () => {
    set({ searchQuery: '' });
    await get().fetchAdmins();
  },

  confirmDelete: (id: string) => {
    set({ adminToDelete: id, showDialog: true });
  },

  cancelDelete: () => {
    set({ adminToDelete: null, showDialog: false });
  },

  deleteAdmin: async () => {
    const { adminToDelete } = get();
    
    if (!adminToDelete) return;
    
    try {
      set({ loading: true, error: null });
      
      await axios.delete(`/admin/${adminToDelete}`);
      
      set({
        loading: false,
        success: 'Admin berhasil dihapus',
        showDialog: false,
        adminToDelete: null,
      });
      
      await get().fetchAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      set({
        loading: false,
        error: error.response?.data?.message || 'Gagal menghapus admin',
        showDialog: false,
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

import { create } from 'zustand';
import { getAdmins, deleteAdmin } from '@/lib/auth';
import { Admin } from '@/lib/types/admin';
import { getAdminData } from '@/lib/cookies';

interface AdminState {
  admins: Admin[];
  currentAdmin: Admin | null;
  loading: boolean;
  error: string;
  success: string;
  searchQuery: string;
  showDialog: boolean;
  adminToDelete: string | null;
  
  fetchAdmins: () => Promise<void>;
  handleSearch: (query: string) => void;
  resetSearch: () => void;
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
  error: '',
  success: '',
  searchQuery: '',
  showDialog: false,
  adminToDelete: null,
  
  fetchAdmins: async () => {
    try {
      set({ loading: true, error: '' });
      
      if (!get().currentAdmin) {
        const adminData = getAdminData();
        if (adminData) {
          set({
            currentAdmin: {
              ...adminData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          });
        }
      }
      
      const response = await getAdmins();
      set({ admins: response, loading: false });
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
      set({ error: "Gagal mengambil data admin", loading: false });
    }
  },
  
  handleSearch: (query: string) => {
    const { admins } = get();
    
    if (!query) {
      get().fetchAdmins();
      return;
    }
    
    const filtered = admins.filter(
      (admin) =>
        admin.nama.toLowerCase().includes(query.toLowerCase()) ||
        admin.username.toLowerCase().includes(query.toLowerCase())
    );
    
    set({ admins: filtered, searchQuery: query });
  },
  
  resetSearch: () => {
    set({ searchQuery: '' });
    get().fetchAdmins();
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
      set({ loading: true, error: '' });
      await deleteAdmin(adminToDelete);
      set({ 
        success: "Admin berhasil dihapus", 
        loading: false,
        showDialog: false,
        adminToDelete: null
      });
      get().fetchAdmins();
    } catch (error) {
      console.error("Gagal menghapus admin:", error);
      set({ 
        error: "Gagal menghapus admin", 
        loading: false,
        showDialog: false,
        adminToDelete: null
      });
    }
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  
  clearMessages: () => {
    set({ error: '', success: '' });
  }
})); 
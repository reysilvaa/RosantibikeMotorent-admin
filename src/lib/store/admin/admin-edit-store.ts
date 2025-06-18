import { create } from 'zustand';
import { getAdminById, updateAdmin } from '@/lib/auth';
import { Admin } from '@/lib/types/admin';
import { toast } from 'sonner';

interface AdminEditFormData {
  nama: string;
  username: string;
  password: string;
}

interface AdminEditState {
  admin: Admin | null;
  formData: AdminEditFormData;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  
  fetchAdmin: (id: string) => Promise<void>;
  setFormData: (data: Partial<AdminEditFormData>) => void;
  resetMessages: () => void;
  submitForm: (id: string) => Promise<boolean>;
}

const initialFormData: AdminEditFormData = {
  nama: '',
  username: '',
  password: '',
};

export const useAdminEditStore = create<AdminEditState>((set, get) => ({
  admin: null,
  formData: initialFormData,
  loading: false,
  saving: false,
  error: '',
  success: '',
  
  fetchAdmin: async (id) => {
    try {
      set({ loading: true, error: '' });
      const data = await getAdminById(id);
      
      set({
        admin: data,
        formData: {
          nama: data.nama || '',
          username: data.username || '',
          password: '',
        },
        loading: false
      });
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
      set({ 
        loading: false, 
        error: "Gagal mengambil data admin" 
      });
    }
  },
  
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  
  resetMessages: () => {
    set({ error: '', success: '' });
  },
  
  submitForm: async (id) => {
    const { formData } = get();
    
    // Validasi form
    if (!formData.nama.trim()) {
      set({ error: "Nama harus diisi" });
      return false;
    }
    
    if (!formData.username.trim()) {
      set({ error: "Username harus diisi" });
      return false;
    }
    
    // Buat objek data untuk dikirim ke API
    const updateData: {
      nama: string;
      username: string;
      password?: string;
    } = {
      nama: formData.nama,
      username: formData.username,
    };
    
    // Hanya tambahkan password jika diisi
    if (formData.password.trim()) {
      updateData.password = formData.password;
    }

    try {
      set({ saving: true, error: '', success: '' });
      
      const result = await updateAdmin(id, updateData);

      set({ 
        saving: false,
        success: "Admin berhasil diperbarui",
        admin: result
      });
      
      toast.success("Admin berhasil diperbarui");
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui admin";
      console.error("Gagal memperbarui admin:", error);
      set({ 
        saving: false, 
        error: errorMessage
      });
      return false;
    }
  },
})); 
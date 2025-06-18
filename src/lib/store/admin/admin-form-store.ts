import { create } from 'zustand';
import { createAdmin } from '@/lib/auth';
import { toast } from 'sonner';

interface AdminFormData {
  nama: string;
  username: string;
  password: string;
}

interface AdminFormState {
  formData: AdminFormData;
  loading: boolean;
  error: string;
  success: string;
  
  setFormData: (data: Partial<AdminFormData>) => void;
  resetForm: () => void;
  resetMessages: () => void;
  submitForm: () => Promise<boolean>;
}

const initialFormData: AdminFormData = {
  nama: '',
  username: '',
  password: '',
};

export const useAdminFormStore = create<AdminFormState>((set, get) => ({
  formData: initialFormData,
  loading: false,
  error: '',
  success: '',
  
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  
  resetForm: () => {
    set({
      formData: initialFormData,
      error: '',
      success: '',
    });
  },
  
  resetMessages: () => {
    set({ error: '', success: '' });
  },
  
  submitForm: async () => {
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
    
    if (!formData.password.trim()) {
      set({ error: "Password harus diisi" });
      return false;
    }

    try {
      set({ loading: true, error: '', success: '' });
      
      await createAdmin({
        nama: formData.nama,
        username: formData.username,
        password: formData.password
      });

      set({ 
        loading: false,
        success: "Admin berhasil ditambahkan",
        formData: initialFormData
      });
      
      toast.success("Admin berhasil ditambahkan");
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menambahkan admin";
      console.error("Gagal menambahkan admin:", error);
      set({ 
        loading: false, 
        error: errorMessage
      });
      return false;
    }
  },
})); 
import { create } from 'zustand';
import axios from '../../axios';
import { toast } from '@/components/ui/use-toast';

interface AdminFormData {
  nama: string;
  username: string;
  password: string;
}

interface AdminFormState {
  formData: AdminFormData;
  loading: boolean;
  error: string | null;
  success: string | null;

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
  error: null,
  success: null,

  setFormData: data => {
    set(state => ({
      formData: { ...state.formData, ...data },
    }));
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      error: null,
      success: null,
    });
  },

  resetMessages: () => {
    set({ error: null, success: null });
  },

  submitForm: async () => {
    const { formData } = get();

    if (!formData.nama.trim()) {
      set({ error: 'Nama harus diisi' });
      return false;
    }

    if (!formData.username.trim()) {
      set({ error: 'Username harus diisi' });
      return false;
    }

    if (!formData.password.trim()) {
      set({ error: 'Password harus diisi' });
      return false;
    }

    try {
      set({ loading: true, error: null, success: null });

      await axios.post('/admin', {
        nama: formData.nama,
        username: formData.username,
        password: formData.password,
      });

      set({
        loading: false,
        success: 'Admin berhasil ditambahkan',
        formData: initialFormData,
      });

      toast({
        title: "Berhasil",
        description: "Admin berhasil ditambahkan",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan admin';
      console.error('Gagal menambahkan admin:', error);
      
      set({
        loading: false,
        error: errorMessage,
      });
      
      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  },
}));

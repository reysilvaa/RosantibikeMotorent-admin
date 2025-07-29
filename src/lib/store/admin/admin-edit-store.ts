import { create } from 'zustand';
import axios from '../../axios';
import { Admin } from '../../types/admin';
import { toast } from '@/components/ui/use-toast';

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
  error: string | null;
  success: string | null;

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
  error: null,
  success: null,

  fetchAdmin: async id => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/admin/${id}`);
      const data = response.data.data;

      set({
        admin: data,
        formData: {
          nama: data.nama || '',
          username: data.username || '',
          password: '',
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('Gagal mengambil data admin:', error);
      set({
        loading: false,
        error: error.response?.data?.message || 'Gagal mengambil data admin',
      });
    }
  },

  setFormData: data => {
    set(state => ({
      formData: { ...state.formData, ...data },
    }));
  },

  resetMessages: () => {
    set({ error: null, success: null });
  },

  submitForm: async id => {
    const { formData } = get();

    if (!formData.nama.trim()) {
      set({ error: 'Nama harus diisi' });
      return false;
    }

    if (!formData.username.trim()) {
      set({ error: 'Username harus diisi' });
      return false;
    }

    const updateData: {
      nama: string;
      username: string;
      password?: string;
    } = {
      nama: formData.nama,
      username: formData.username,
    };

    if (formData.password.trim()) {
      updateData.password = formData.password;
    }

    try {
      set({ saving: true, error: null, success: null });

      const response = await axios.patch(`/admin/${id}`, updateData);
      const updatedAdmin = response.data.data;

      set({
        saving: false,
        success: 'Admin berhasil diperbarui',
        admin: updatedAdmin,
      });

      toast({
        title: "Berhasil",
        description: "Admin berhasil diperbarui",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui admin';
      console.error('Gagal memperbarui admin:', error);
      
      set({
        saving: false,
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

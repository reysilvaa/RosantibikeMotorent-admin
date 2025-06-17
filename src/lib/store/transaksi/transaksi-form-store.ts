import { create } from 'zustand';
import { createTransaksi } from '@/lib/api/transaksi';
import { Transaksi } from '@/lib/types/transaksi';

interface TransaksiFormState {
  formData: Partial<Transaksi>;
  setFormData: (data: Partial<Transaksi>) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

const initialFormData: Partial<Transaksi> = {
  namaPenyewa: '',
  noWhatsapp: '',
  alamat: '',
  unitId: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  totalBiaya: 0,
  helm: 0,
  jasHujan: 0,
};

export const useTransaksiFormStore = create<TransaksiFormState>((set, get) => ({
  formData: { ...initialFormData },
  
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  
  resetForm: () => {
    set({ formData: { ...initialFormData } });
  },
  
  submitForm: async () => {
    const { formData } = get();
    await createTransaksi(formData);
  }
})); 
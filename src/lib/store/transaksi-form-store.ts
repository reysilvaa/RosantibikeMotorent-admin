import { create } from 'zustand';
import { format } from 'date-fns';
import { Transaksi, StatusTransaksi } from '@/lib/types/transaksi';

interface TransaksiFormState {
  formData: Partial<Transaksi>;
  setFormValue: <K extends keyof Partial<Transaksi>>(key: K, value: Partial<Transaksi>[K]) => void;
  resetForm: () => void;
}

const initialState: Partial<Transaksi> = {
  namaPenyewa: "",
  noWhatsapp: "",
  alamat: "",
  unitId: "",
  tanggalMulai: format(new Date(), "yyyy-MM-dd"),
  tanggalSelesai: format(new Date(), "yyyy-MM-dd"),
  jamMulai: "08:00",
  jamSelesai: "08:00",
  helm: 1,
  jasHujan: 0,
  totalBiaya: 0,
  status: StatusTransaksi.AKTIF
};

export const useTransaksiFormStore = create<TransaksiFormState>((set) => ({
  formData: initialState,
  
  setFormValue: (key, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },
  
  resetForm: () => {
    set({ formData: initialState });
  },
})); 
import { create } from "zustand";
import { toast } from "sonner";
import { createUnitMotor } from "@/lib/api/unit-motor";
import { JenisMotor } from "@/lib/types/jenis-motor";

interface UnitMotorFormData {
  plat: string;
  tahunPembuatan: string;
  hargaSewa: string | number;
  jenisMotorId: string;
}

interface UnitMotorFormState {
  formData: UnitMotorFormData;
  loading: boolean;
  error: string | null;
  success: string | null;
  jenisMotorOptions: JenisMotor[];
  setFormData: (data: Partial<UnitMotorFormData>) => void;
  setJenisMotorOptions: (options: JenisMotor[]) => void;
  resetForm: () => void;
  resetMessages: () => void;
  submitForm: () => Promise<boolean>;
}

const initialFormData: UnitMotorFormData = {
  plat: "",
  tahunPembuatan: new Date().getFullYear().toString(),
  hargaSewa: "",
  jenisMotorId: "",
};

export const useUnitMotorFormStore = create<UnitMotorFormState>((set, get) => ({
  formData: initialFormData,
  loading: false,
  error: null,
  success: null,
  jenisMotorOptions: [],

  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  setJenisMotorOptions: (options) => {
    set({ jenisMotorOptions: options });
  },

  resetForm: () => {
    set({ formData: initialFormData });
  },

  resetMessages: () => {
    set({ error: null, success: null });
  },

  submitForm: async () => {
    const { formData } = get();
    
    // Validasi form
    if (!formData.plat.trim()) {
      set({ error: "Plat nomor harus diisi" });
      return false;
    }
    
    if (!formData.tahunPembuatan.trim()) {
      set({ error: "Tahun pembuatan harus diisi" });
      return false;
    }
    
    if (!formData.hargaSewa) {
      set({ error: "Harga sewa harus diisi" });
      return false;
    }
    
    if (!formData.jenisMotorId) {
      set({ error: "Jenis motor harus dipilih" });
      return false;
    }

    try {
      set({ loading: true, error: null, success: null });

      const hargaSewaNumber = typeof formData.hargaSewa === 'string' 
        ? parseInt(formData.hargaSewa.replace(/\D/g, "")) 
        : formData.hargaSewa;
      
      await createUnitMotor({
        plat: formData.plat,
        tahunPembuatan: formData.tahunPembuatan,
        hargaSewa: hargaSewaNumber,
        jenisMotorId: formData.jenisMotorId,
      });

      set({ 
        loading: false,
        success: "Unit motor berhasil ditambahkan",
        formData: initialFormData 
      });
      
      toast.success("Unit motor berhasil ditambahkan");
      return true;
    } catch (error: any) {
      console.error("Gagal membuat unit motor:", error);
      set({ 
        loading: false, 
        error: error.message || "Gagal membuat unit motor baru" 
      });
      return false;
    }
  },
})); 
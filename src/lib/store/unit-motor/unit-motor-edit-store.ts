import { create } from "zustand";
import { toast } from "sonner";
import { getUnitMotorDetail, updateUnitMotor } from "@/lib/api/unit-motor";
import { JenisMotor } from "@/lib/types/jenis-motor";
import { UnitMotor } from "@/lib/types/unit-motor";

interface UnitMotorEditFormData {
  plat: string;
  tahunPembuatan: string;
  hargaSewa: string | number;
  jenisMotorId: string;
  status: string;
}

interface UnitMotorEditState {
  unitMotor: UnitMotor | null;
  formData: UnitMotorEditFormData;
  loading: boolean;
  saving: boolean;
  error: string | undefined;
  success: string | undefined;
  jenisMotorOptions: JenisMotor[];
  fetchUnitMotor: (id: string) => Promise<void>;
  setFormData: (data: Partial<UnitMotorEditFormData>) => void;
  setJenisMotorOptions: (options: JenisMotor[]) => void;
  resetMessages: () => void;
  updateUnitMotor: (id: string) => Promise<boolean>;
}

const initialFormData: UnitMotorEditFormData = {
  plat: "",
  tahunPembuatan: "",
  hargaSewa: "",
  jenisMotorId: "",
  status: "TERSEDIA"
};

export const useUnitMotorEditStore = create<UnitMotorEditState>((set, get) => ({
  unitMotor: null,
  formData: initialFormData,
  loading: false,
  saving: false,
  error: undefined,
  success: undefined,
  jenisMotorOptions: [],

  fetchUnitMotor: async (id) => {
    try {
      set({ loading: true, error: undefined });
      const data = await getUnitMotorDetail(id);
      
      set({
        unitMotor: data,
        formData: {
          plat: data.platNomor || "",
          tahunPembuatan: data.tahunPembuatan?.toString() || "",
          hargaSewa: data.hargaSewa?.toString() || "",
          jenisMotorId: data.jenis?.id || "",
          status: data.status || "TERSEDIA"
        },
        loading: false
      });
    } catch (error) {
      console.error("Gagal mengambil data unit motor:", error);
      set({ 
        loading: false, 
        error: "Gagal mengambil data unit motor" 
      });
    }
  },

  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  setJenisMotorOptions: (options) => {
    set({ jenisMotorOptions: options });
  },

  resetMessages: () => {
    set({ error: undefined, success: undefined });
  },

  updateUnitMotor: async (id) => {
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
      set({ saving: true, error: undefined, success: undefined });

      const hargaSewaNumber = typeof formData.hargaSewa === 'string' 
        ? parseInt(formData.hargaSewa.replace(/\D/g, "")) 
        : formData.hargaSewa;
      
      const result = await updateUnitMotor(id, {
        plat: formData.plat,
        tahunPembuatan: formData.tahunPembuatan,
        hargaSewa: hargaSewaNumber,
        jenisMotorId: formData.jenisMotorId,
        status: formData.status,
      });

      set({ 
        saving: false,
        success: "Unit motor berhasil diperbarui",
        unitMotor: result
      });
      
      toast.success("Unit motor berhasil diperbarui");
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui unit motor";
      console.error("Gagal memperbarui unit motor:", error);
      set({ 
        saving: false, 
        error: errorMessage
      });
      return false;
    }
  },
})); 
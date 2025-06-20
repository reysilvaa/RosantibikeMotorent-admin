import { create } from 'zustand';
import { JenisMotor } from '@/lib/jenis-motor';
import { UnitMotor } from '@/lib/types/unit-motor';
import {
  deleteUnitMotor,
  getUnitMotorDetail,
  updateUnitMotor,
} from '@/lib/unit-motor';

interface FormData {
  plat: string;
  tahunPembuatan: string;
  hargaSewa: string;
  jenisMotorId: string;
  status: string;
}

interface UnitMotorDetailState {
  unitMotor: UnitMotor | null;
  jenisMotorOptions: JenisMotor[];
  formData: FormData;

  loading: boolean;
  saving: boolean;
  deleting: boolean;
  editing: boolean;
  confirmDelete: boolean;
  error: string;
  success: string;

  fetchUnitMotor: (id: string) => Promise<void>;
  setFormData: (data: Partial<FormData>) => void;
  setEditing: (value: boolean) => void;
  setConfirmDelete: (value: boolean) => void;
  updateUnitMotor: (id: string) => Promise<void>;
  deleteUnitMotor: (id: string) => Promise<void>;
  resetMessages: () => void;
}

export const useUnitMotorDetailStore = create<UnitMotorDetailState>(
  (set, get) => ({
    unitMotor: null,
    jenisMotorOptions: [],
    formData: {
      plat: '',
      tahunPembuatan: '',
      hargaSewa: '',
      jenisMotorId: '',
      status: '',
    },

    loading: true,
    saving: false,
    deleting: false,
    editing: false,
    confirmDelete: false,
    error: '',
    success: '',

    fetchUnitMotor: async (id: string) => {
      try {
        set({ loading: true, error: '' });
        const data = await getUnitMotorDetail(id);

        set({
          unitMotor: data,
          formData: {
            plat: data.platNomor || '',
            tahunPembuatan: data.tahunPembuatan?.toString() || '',
            hargaSewa: data.hargaSewa?.toString() || '',
            jenisMotorId: data.jenis?.id || '',
            status: data.status || '',
          },
        });
      } catch (error) {
        console.error('Gagal mengambil data unit motor:', error);
        set({ error: 'Gagal mengambil data unit motor' });
      } finally {
        set({ loading: false });
      }
    },

    setFormData: (data: Partial<FormData>) => {
      set(state => ({
        formData: { ...state.formData, ...data },
      }));
    },

    setEditing: (value: boolean) => {
      const { unitMotor } = get();

      set({
        editing: value,
        error: '',
        success: '',
      });

      if (!value && unitMotor) {
        set({
          formData: {
            plat: unitMotor.platNomor || '',
            tahunPembuatan: unitMotor.tahunPembuatan?.toString() || '',
            hargaSewa: unitMotor.hargaSewa?.toString() || '',
            jenisMotorId: unitMotor.jenis?.id || '',
            status: unitMotor.status || '',
          },
        });
      }
    },

    setConfirmDelete: (value: boolean) => {
      set({ confirmDelete: value });
    },

    updateUnitMotor: async (id: string) => {
      const { formData } = get();

      try {
        set({ saving: true, error: '' });

        const updatedData = {
          plat: formData.plat,
          tahunPembuatan: formData.tahunPembuatan,
          hargaSewa: parseInt(formData.hargaSewa),
          jenisMotorId: formData.jenisMotorId,
          status: formData.status,
        };

        const result = await updateUnitMotor(id, updatedData);
        set({
          unitMotor: result,
          success: 'Unit motor berhasil diperbarui',
          editing: false,
        });
      } catch (error) {
        console.error('Gagal memperbarui unit motor:', error);
        set({ error: 'Gagal memperbarui unit motor' });
      } finally {
        set({ saving: false });
      }
    },

    deleteUnitMotor: async (id: string) => {
      try {
        set({ deleting: true, error: '' });
        await deleteUnitMotor(id);
        set({ success: 'Unit motor berhasil dihapus' });
        return Promise.resolve();
      } catch (error) {
        console.error('Gagal menghapus unit motor:', error);
        set({
          error: 'Gagal menghapus unit motor',
          confirmDelete: false,
        });
        return Promise.reject(error);
      } finally {
        set({ deleting: false });
      }
    },

    resetMessages: () => {
      set({ error: '', success: '' });
    },
  })
);

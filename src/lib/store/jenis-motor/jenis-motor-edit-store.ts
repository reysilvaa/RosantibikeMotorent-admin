import { create } from 'zustand';
import { getJenisMotorDetail, updateJenisMotor } from '@/lib/jenis-motor';
import { JenisMotor } from '@/lib/types/jenis-motor';

interface JenisMotorEditState {
  jenisMotor: JenisMotor | null;
  formData: {
    merk: string;
    model: string;
    cc: number;
    gambar?: string;
  };
  selectedFile: File | null;
  loading: boolean;
  loadingSubmit: boolean;
  error: string;
  success: boolean;

  fetchJenisMotor: (id: string) => Promise<void>;
  setFormData: (data: Partial<JenisMotorEditState['formData']>) => void;
  setSelectedFile: (file: File | null) => void;
  submitForm: (id: string) => Promise<void>;
  resetForm: () => void;
}

export const useJenisMotorEditStore = create<JenisMotorEditState>(
  (set, get) => ({
    jenisMotor: null,
    formData: {
      merk: '',
      model: '',
      cc: 0,
      gambar: '',
    },
    selectedFile: null,
    loading: false,
    loadingSubmit: false,
    error: '',
    success: false,

    fetchJenisMotor: async (id: string) => {
      try {
        set({ loading: true, error: '' });
        const data = await getJenisMotorDetail(id);
        set({
          jenisMotor: data,
          formData: {
            merk: data.merk,
            model: data.model,
            cc: data.cc,
            gambar: data.gambar || '',
          },
          loading: false,
        });
      } catch (error) {
        console.error('Gagal mengambil data jenis motor:', error);
        set({
          error: 'Gagal mengambil data jenis motor',
          loading: false,
        });
      }
    },

    setFormData: data => {
      set({ formData: { ...get().formData, ...data } });
    },

    setSelectedFile: file => {
      set({ selectedFile: file });
    },

    submitForm: async (id: string) => {
      try {
        set({ loadingSubmit: true, error: '', success: false });
        const { formData, selectedFile } = get();

        if (!formData.merk || !formData.model || !formData.cc) {
          set({
            error: 'Merk, model, dan CC harus diisi',
            loadingSubmit: false,
          });
          return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('merk', formData.merk);
        formDataToSubmit.append('model', formData.model);
        formDataToSubmit.append('cc', formData.cc.toString());

        if (selectedFile) {
          formDataToSubmit.append('file', selectedFile);
        }

        await updateJenisMotor(id, formDataToSubmit);

        set({
          loadingSubmit: false,
          success: true,
        });
      } catch (error) {
        console.error('Gagal memperbarui jenis motor:', error);
        set({
          error: 'Gagal memperbarui jenis motor',
          loadingSubmit: false,
        });
      }
    },

    resetForm: () => {
      set({
        jenisMotor: null,
        formData: {
          merk: '',
          model: '',
          cc: 0,
          gambar: '',
        },
        selectedFile: null,
        loading: false,
        loadingSubmit: false,
        error: '',
        success: false,
      });
    },
  })
);

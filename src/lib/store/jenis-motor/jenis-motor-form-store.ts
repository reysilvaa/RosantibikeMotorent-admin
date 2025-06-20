import { create } from 'zustand';
import { createJenisMotor } from '@/lib/jenis-motor';

interface JenisMotorFormState {
  formData: {
    merk: string;
    model: string;
    cc: number;
  };
  selectedFile: File | null;
  loading: boolean;
  error: string;
  success: boolean;

  setFormData: (data: Partial<JenisMotorFormState['formData']>) => void;
  setSelectedFile: (file: File | null) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

export const useJenisMotorFormStore = create<JenisMotorFormState>(
  (set, get) => ({
    formData: {
      merk: '',
      model: '',
      cc: 0,
    },
    selectedFile: null,
    loading: false,
    error: '',
    success: false,

    setFormData: data => {
      set({ formData: { ...get().formData, ...data } });
    },

    setSelectedFile: file => {
      set({ selectedFile: file });
    },

    submitForm: async () => {
      try {
        set({ loading: true, error: '', success: false });
        const { formData, selectedFile } = get();

        if (!formData.merk || !formData.model || !formData.cc) {
          set({
            error: 'Merk, model, dan CC harus diisi',
            loading: false,
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

        await createJenisMotor(formDataToSubmit);

        set({
          loading: false,
          success: true,
        });
      } catch (error) {
        console.error('Gagal menambahkan jenis motor:', error);
        set({
          error: 'Gagal menambahkan jenis motor',
          loading: false,
        });
      }
    },

    resetForm: () => {
      set({
        formData: {
          merk: '',
          model: '',
          cc: 0,
        },
        selectedFile: null,
        loading: false,
        error: '',
        success: false,
      });
    },
  })
);

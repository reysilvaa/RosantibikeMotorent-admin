import { create } from 'zustand';
import { JenisMotor, createJenisMotor } from '@/lib/jenis-motor';

interface JenisMotorFormState {
  formData: Partial<JenisMotor>;
  selectedFile: File | null;
  previewUrl: string | null;
  loading: boolean;
  error: string;
  success: string;
  
  // Actions
  setFormData: (data: Partial<JenisMotor>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  submitForm: () => Promise<void>;
  generateSlug: (merk: string, model: string) => string;
}

export const useJenisMotorFormStore = create<JenisMotorFormState>((set, get) => ({
  formData: {},
  selectedFile: null,
  previewUrl: null,
  loading: false,
  error: "",
  success: "",
  
  setFormData: (data) => set({ formData: { ...get().formData, ...data } }),
  
  handleInputChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    }));
  },
  
  handleFileChange: (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      set({ selectedFile: file });
      
      // Membuat URL preview untuk gambar
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          set({ previewUrl: event.target.result as string });
        }
      };
      fileReader.readAsDataURL(file);
    }
  },
  
  resetForm: () => {
    set({
      formData: {},
      selectedFile: null,
      previewUrl: null,
      error: "",
      success: "",
    });
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSuccess: (success) => set({ success }),
  
  generateSlug: (merk, model) => {
    return `${merk} ${model}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Hapus karakter khusus
      .replace(/\s+/g, '-')     // Ganti spasi dengan tanda -
      .replace(/-+/g, '-')      // Hindari tanda - berulang
      .trim();                  // Hapus spasi di awal dan akhir
  },
  
  submitForm: async () => {
    const { formData, selectedFile, generateSlug } = get();
    
    // Validasi form
    if (!formData.merk || !formData.model || !formData.cc) {
      set({ error: "Semua field harus diisi" });
      return;
    }
    
    if (isNaN(Number(formData.cc)) || Number(formData.cc) < 50) {
      set({ error: "CC motor minimal 50" });
      return;
    }
    
    try {
      set({ loading: true, error: "" });
            
      if (selectedFile) {
        // Jika ada file, gunakan FormData
        const submitData = new FormData();
        submitData.append("merk", formData.merk);
        submitData.append("model", formData.model);
        submitData.append("cc", formData.cc.toString());
        
        // Buat slug otomatis dari merk dan model
        const slug = generateSlug(formData.merk, formData.model);
        submitData.append("slug", slug);
        submitData.append("file", selectedFile);
        
        // Kirim data ke server
        await createJenisMotor(submitData);
      } else {
        // Jika tidak ada file, kirim data sebagai JSON
        const jsonData = {
          merk: formData.merk,
          model: formData.model,
          cc: formData.cc,
          slug: generateSlug(formData.merk, formData.model)
        };
        
        // Kirim data ke server
        await createJenisMotor(jsonData);
      }
      
      set({ success: "Jenis motor berhasil ditambahkan" });
      
      // Reset form
      get().resetForm();
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Gagal menambahkan jenis motor:", error);
      set({ error: `Gagal membuat jenis motor: ${error.message}` });
      return Promise.reject(error);
    } finally {
      set({ loading: false });
    }
  },
})); 
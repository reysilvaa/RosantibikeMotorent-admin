import { create } from 'zustand';
import { createBlogPost, updateBlogPost } from '@/lib/api/blog';
import { BlogStatus } from '@/lib/types/blog';

interface BlogFormData {
  judul: string;
  konten: string;
  status: BlogStatus;
  kategori: string;
  tags: string[];
}

interface BlogFormState {
  formData: BlogFormData;
  selectedFile: File | null;
  loading: boolean;
  error: string;
  success: boolean;
  
  setFormData: (data: Partial<BlogFormData>) => void;
  setSelectedFile: (file: File | null) => void;
  submitForm: () => Promise<boolean>;
  updateForm: (id: string) => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: BlogFormData = {
  judul: '',
  konten: '',
  status: BlogStatus.DRAFT,
  kategori: '',
  tags: [],
};

export const useBlogFormStore = create<BlogFormState>((set, get) => ({
  formData: initialFormData,
  selectedFile: null,
  loading: false,
  error: '',
  success: false,
  
  setFormData: (data) => {
    set({ formData: { ...get().formData, ...data } });
  },
  
  setSelectedFile: (file) => {
    set({ selectedFile: file });
  },
  
  submitForm: async () => {
    try {
      set({ loading: true, error: '', success: false });
      const { formData, selectedFile } = get();
      
      // Validasi form
      if (!formData.judul || !formData.konten) {
        set({ 
          error: "Judul dan konten harus diisi", 
          loading: false 
        });
        return false;
      }
      
      // Persiapkan FormData untuk dikirim
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('judul', formData.judul);
      formDataToSubmit.append('konten', formData.konten);
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('kategori', formData.kategori);
      
      // Tambahkan tags jika ada
      // Backend mengharapkan array string untuk tags, bukan FormData entries
      // Jadi kita perlu memastikan tags dikirim sebagai string array
      if (formData.tags && formData.tags.length > 0) {
        // Untuk setiap tag, kita tambahkan sebagai entry terpisah
        // FormData akan mengirimkan ini sebagai array di backend
        formData.tags.forEach((tag) => {
          if (tag && tag.trim() !== '') {
            formDataToSubmit.append('tags', tag);
          }
        });
      } else {
        // Jika tidak ada tags, kirim array kosong
        formDataToSubmit.append('tags', '');
      }
      
      // Tambahkan file jika ada
      if (selectedFile) {
        formDataToSubmit.append('file', selectedFile);
      }
      
      await createBlogPost(formDataToSubmit);
      
      set({ 
        loading: false,
        success: true
      });
      
      return true;
    } catch (error) {
      console.error("Gagal menambahkan blog:", error);
      set({ 
        error: "Gagal menambahkan blog", 
        loading: false 
      });
      return false;
    }
  },
  
  updateForm: async (id: string) => {
    try {
      set({ loading: true, error: '', success: false });
      const { formData, selectedFile } = get();
      
      // Validasi form
      if (!formData.judul || !formData.konten) {
        set({ 
          error: "Judul dan konten harus diisi", 
          loading: false 
        });
        return false;
      }
      
      // Persiapkan FormData untuk dikirim
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('judul', formData.judul);
      formDataToSubmit.append('konten', formData.konten);
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('kategori', formData.kategori);
      
      // Tambahkan tags jika ada - pastikan tags adalah ID yang valid
      // Backend mengharapkan ID tag yang valid, bukan nama tag
      if (formData.tags && formData.tags.length > 0) {
        // Pastikan tags adalah array
        const tagsArray = Array.isArray(formData.tags) ? formData.tags : [formData.tags];
        
        // Tambahkan setiap tag ke formData
        tagsArray.forEach(tag => {
          // Jika tag adalah string kosong, lewati
          if (tag && tag.trim() !== '') {
            formDataToSubmit.append('tags', tag);
          }
        });
      } else {
        // Jika tidak ada tags, kirim array kosong untuk menghapus semua tags
        formDataToSubmit.append('tags', '');
      }
      
      // Tambahkan file jika ada
      if (selectedFile) {
        formDataToSubmit.append('file', selectedFile);
      }
      
      await updateBlogPost(id, formDataToSubmit);
      
      set({ 
        loading: false,
        success: true
      });
      
      return true;
    } catch (error) {
      console.error("Gagal memperbarui blog:", error);
      set({ 
        error: "Gagal memperbarui blog", 
        loading: false 
      });
      return false;
    }
  },
  
  resetForm: () => {
    set({
      formData: initialFormData,
      selectedFile: null,
      loading: false,
      error: '',
      success: false
    });
  }
})); 
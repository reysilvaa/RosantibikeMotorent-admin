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

      if (!formData.judul || !formData.konten) {
        set({
          error: 'Judul dan konten harus diisi',
          loading: false,
        });
        return false;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('judul', formData.judul);
      formDataToSubmit.append('konten', formData.konten);
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('kategori', formData.kategori);

      if (formData.tags && formData.tags.length > 0) {
        const tagsArray = Array.isArray(formData.tags)
          ? formData.tags
          : [formData.tags];

        tagsArray.forEach(tag => {
          if (tag && tag.trim() !== '') {
            formDataToSubmit.append('tags', tag);
          }
        });
      } else {
        formDataToSubmit.append('tags', '');
      }

      if (selectedFile) {
        formDataToSubmit.append('file', selectedFile);
      }

      await createBlogPost(formDataToSubmit);

      try {
        localStorage.removeItem('blog_draft_new');
      } catch (e) {
        console.error('Gagal menghapus draft dari localStorage:', e);
      }

      set({
        loading: false,
        success: true,
      });

      return true;
    } catch (error) {
      console.error('Gagal menambahkan blog:', error);
      set({
        error: 'Gagal menambahkan blog',
        loading: false,
      });
      return false;
    }
  },

  updateForm: async (id: string) => {
    try {
      set({ loading: true, error: '', success: false });
      const { formData, selectedFile } = get();

      if (!formData.judul || !formData.konten) {
        set({
          error: 'Judul dan konten harus diisi',
          loading: false,
        });
        return false;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('judul', formData.judul);
      formDataToSubmit.append('konten', formData.konten);
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('kategori', formData.kategori);

      if (formData.tags && formData.tags.length > 0) {
        const tagsArray = Array.isArray(formData.tags)
          ? formData.tags
          : [formData.tags];

        tagsArray.forEach(tag => {
          if (tag && tag.trim() !== '') {
            formDataToSubmit.append('tags', tag);
          }
        });
      } else {
        formDataToSubmit.append('tags', '');
      }

      if (selectedFile) {
        formDataToSubmit.append('file', selectedFile);
      }

      await updateBlogPost(id, formDataToSubmit);

      try {
        localStorage.removeItem(`blog_draft_${id}`);
      } catch (e) {
        console.error('Gagal menghapus draft dari localStorage:', e);
      }

      set({
        loading: false,
        success: true,
      });

      return true;
    } catch (error) {
      console.error('Gagal memperbarui blog:', error);
      set({
        error: 'Gagal memperbarui blog',
        loading: false,
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
      success: false,
    });
  },
}));

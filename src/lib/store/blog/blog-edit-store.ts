import { create } from 'zustand';
import { getBlogPost, updateBlogPost } from '@/lib/api/blog';
import { Blog, BlogStatus } from '@/lib/types/blog';

interface BlogEditFormData {
  judul: string;
  konten: string;
  status: BlogStatus;
  kategori: string;
  tags: string[];
}

interface BlogEditState {
  blog: Blog | null;
  formData: BlogEditFormData;
  selectedFile: File | null;
  loading: boolean;
  loadingSubmit: boolean;
  error: string;
  success: boolean;

  fetchBlog: (id: string) => Promise<void>;
  setFormData: (data: Partial<BlogEditFormData>) => void;
  setSelectedFile: (file: File | null) => void;
  submitForm: (id: string) => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: BlogEditFormData = {
  judul: '',
  konten: '',
  status: BlogStatus.DRAFT,
  kategori: '',
  tags: [],
};

export const useBlogEditStore = create<BlogEditState>((set, get) => ({
  blog: null,
  formData: initialFormData,
  selectedFile: null,
  loading: false,
  loadingSubmit: false,
  error: '',
  success: false,

  fetchBlog: async (id: string) => {
    try {
      set({ loading: true, error: '', success: false });
      const data = await getBlogPost(id);

      const tags =
        data.tags?.map(
          (tagItem: { tag: { id: string; nama: string } }) => tagItem.tag.id
        ) || [];

      set({
        blog: data,
        formData: {
          judul: data.judul || '',
          konten: data.konten || '',
          status: data.status || BlogStatus.DRAFT,
          kategori: data.kategori || '',
          tags: tags,
        },
        loading: false,
      });
    } catch (error) {
      console.error('Gagal mengambil data blog:', error);
      set({
        error: 'Gagal mengambil data blog',
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

      if (!formData.judul || !formData.konten) {
        set({
          error: 'Judul dan konten harus diisi',
          loadingSubmit: false,
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
        loadingSubmit: false,
        success: true,
      });

      return true;
    } catch (error) {
      console.error('Gagal memperbarui blog:', error);
      set({
        error: 'Gagal memperbarui blog',
        loadingSubmit: false,
      });
      return false;
    }
  },

  resetForm: () => {
    set({
      blog: null,
      formData: initialFormData,
      selectedFile: null,
      loading: false,
      loadingSubmit: false,
      error: '',
      success: false,
    });
  },
}));

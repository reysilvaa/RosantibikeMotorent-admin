import { create } from 'zustand';
import { getBlogPost } from '@/lib/api/blog';
import { Blog } from '@/lib/types/blog';

interface BlogDetailState {
  blog: Blog | null;
  loading: boolean;
  error: string;

  fetchBlog: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useBlogDetailStore = create<BlogDetailState>(set => ({
  blog: null,
  loading: false,
  error: '',

  fetchBlog: async (id: string) => {
    try {
      set({ loading: true, error: '' });
      const data = await getBlogPost(id);
      set({ blog: data, loading: false });
    } catch (error) {
      console.error('Gagal mengambil data blog:', error);
      set({ error: 'Gagal mengambil data blog', loading: false });
    }
  },

  resetState: () => {
    set({ blog: null, loading: false, error: '' });
  },
}));

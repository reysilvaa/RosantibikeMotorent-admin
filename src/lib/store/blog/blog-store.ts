import { create } from 'zustand';
import { deleteBlogPost, getBlogPosts } from '@/lib/api/blog';
import { Blog, BlogPostFilter, BlogStatus } from '@/lib/types/blog';

interface BlogState {
  data: Blog[];
  loading: boolean;
  error: string;
  success: string;
  searchQuery: string;
  statusFilter: BlogStatus | '';
  currentPage: number;
  totalPages: number;
  totalData: number;
  limit: number;
  showDeleteDialog: boolean;
  blogToDelete: string | null;

  fetchBlogs: (page?: number, filter?: BlogPostFilter) => Promise<void>;
  handleSearch: (e: React.FormEvent) => void;
  setSearchQuery: (query: string) => void;
  handleStatusFilterChange: (status: BlogStatus | '') => void;
  handlePageChange: (page: number) => void;
  resetSearch: () => void;
  confirmDelete: (id: string) => void;
  cancelDelete: () => void;
  deleteBlog: () => Promise<void>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  data: [],
  loading: false,
  error: '',
  success: '',
  searchQuery: '',
  statusFilter: '',
  currentPage: 1,
  totalPages: 1,
  totalData: 0,
  limit: 10,
  showDeleteDialog: false,
  blogToDelete: null,

  fetchBlogs: async (page = 1, filter = {}) => {
    try {
      set({ loading: true, error: '', success: '' });
      const { searchQuery, statusFilter, limit } = get();

      const params: BlogPostFilter = {
        page,
        limit,
        ...filter,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await getBlogPosts(params);

      set({
        data: response.data,
        totalData: response.meta.totalItems || 0,
        totalPages: Math.ceil((response.meta.totalItems || 0) / limit),
        currentPage: page,
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

  handleSearch: (e: React.FormEvent) => {
    e.preventDefault();
    const { fetchBlogs } = get();
    fetchBlogs(1);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  handleStatusFilterChange: (status: BlogStatus | '') => {
    set({ statusFilter: status });
    get().fetchBlogs(1, { status: status || undefined });
  },

  handlePageChange: (page: number) => {
    get().fetchBlogs(page);
  },

  resetSearch: () => {
    set({ searchQuery: '', statusFilter: '' });
    get().fetchBlogs(1, {});
  },

  confirmDelete: (id: string) => {
    set({ blogToDelete: id, showDeleteDialog: true });
  },

  cancelDelete: () => {
    set({ blogToDelete: null, showDeleteDialog: false });
  },

  deleteBlog: async () => {
    const { blogToDelete, fetchBlogs } = get();

    if (!blogToDelete) return;

    try {
      set({ loading: true, error: '', success: '' });
      await deleteBlogPost(blogToDelete);
      set({
        success: 'Blog berhasil dihapus',
        showDeleteDialog: false,
        blogToDelete: null,
      });
      await fetchBlogs();
    } catch (error) {
      console.error('Gagal menghapus blog:', error);
      set({
        error: 'Gagal menghapus blog',
        loading: false,
        showDeleteDialog: false,
        blogToDelete: null,
      });
    }
  },
}));

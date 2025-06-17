import { create } from "zustand";
import { BlogPost, BlogPostFilter, getBlogList, removeBlog } from "@/lib/blog";

interface BlogListState {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
  success: string | null;
  filter: BlogPostFilter;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  
  // Actions
  setFilter: (filter: Partial<BlogPostFilter>) => void;
  resetFilter: () => void;
  fetchBlogs: () => Promise<void>;
  deleteBlog: (id: string) => Promise<boolean>;
  setPage: (page: number) => void;
  resetMessages: () => void;
}

export const useBlogListStore = create<BlogListState>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,
  success: null,
  filter: {
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    category: undefined,
  },
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  
  setFilter: (filter) => {
    set((state) => ({
      filter: { ...state.filter, ...filter, page: 1 },
    }));
    get().fetchBlogs();
  },
  
  resetFilter: () => {
    set({
      filter: {
        page: 1,
        limit: 10,
        search: "",
        status: undefined,
        category: undefined,
      },
    });
    get().fetchBlogs();
  },
  
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getBlogList(get().filter);
      set({
        blogs: response.data,
        meta: response.meta,
      });
    } catch (error) {
      console.error("Error mengambil data blog:", error);
      set({ error: "Gagal mengambil data blog" });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteBlog: async (id) => {
    set({ loading: true, error: null, success: null });
    try {
      await removeBlog(id);
      set({ success: "Blog berhasil dihapus" });
      await get().fetchBlogs();
      return true;
    } catch (error) {
      console.error("Error menghapus blog:", error);
      set({ error: "Gagal menghapus blog" });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  setPage: (page) => {
    if (page !== get().filter.page) {
      set((state) => ({
        filter: { ...state.filter, page },
      }));
      get().fetchBlogs();
    }
  },
  
  resetMessages: () => {
    set({ error: null, success: null });
  },
})); 
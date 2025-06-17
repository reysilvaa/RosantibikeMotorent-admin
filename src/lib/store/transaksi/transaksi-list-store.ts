import { create } from 'zustand';
import { getTransaksi, Transaksi, StatusTransaksi, FilterTransaksi } from '@/lib/transaksi';

interface TransaksiListState {
  transaksi: Transaksi[];
  loading: boolean;
  searchQuery: string;
  statusFilter: StatusTransaksi | "";
  currentPage: number;
  totalPages: number;
  totalData: number;
  limit: number;
  
  fetchTransaksi: (page?: number, filter?: FilterTransaksi) => Promise<void>;
  setSearchQuery: (query: string) => void;
  handleStatusFilterChange: (status: StatusTransaksi | "") => void;
  handlePageChange: (page: number) => void;
  handleResetFilter: () => void;
}

export const useTransaksiListStore = create<TransaksiListState>((set, get) => ({
  transaksi: [],
  loading: false,
  searchQuery: "",
  statusFilter: "",
  currentPage: 1,
  totalPages: 1,
  totalData: 0,
  limit: 10,
  
  fetchTransaksi: async (page = 1, filter = {}) => {
    try {
      set({ loading: true });
      const { searchQuery, statusFilter, limit } = get();
      
      const params: FilterTransaksi = {
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

      const response = await getTransaksi(params);
      
      set({
        transaksi: response.data,
        totalData: response.meta.totalItems || 0,
        totalPages: Math.ceil((response.meta.totalItems || 0) / limit),
        currentPage: page,
        loading: false
      });
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
      set({ loading: false });
    }
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  handleStatusFilterChange: (status) => {
    set({ statusFilter: status });
    get().fetchTransaksi(1, { status: status || undefined });
  },
  
  handlePageChange: (page) => {
    get().fetchTransaksi(page);
  },
  
  handleResetFilter: () => {
    set({ searchQuery: "", statusFilter: "" });
    get().fetchTransaksi(1, {});
  }
})); 
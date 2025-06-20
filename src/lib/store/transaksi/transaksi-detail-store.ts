import { create } from 'zustand';
import {
  getTransaksiDetail,
  selesaikanTransaksi,
  StatusTransaksi,
  Transaksi,
} from '@/lib/transaksi';

type DateFormatter = (date: string) => string;

interface TransaksiDetailState {
  transaksi: Transaksi | null;
  loading: boolean;
  processing: boolean;
  error: string;
  success: string;

  fetchTransaksiDetail: (id: string) => Promise<void>;
  handleSelesaikan: (id: string) => Promise<void>;
  resetMessages: () => void;
  getStatusBadgeClass: (status: StatusTransaksi) => string;
  safeDateFormat: (
    dateString: string | null | undefined,
    formatter: DateFormatter
  ) => string;
}

export const useTransaksiDetailStore = create<TransaksiDetailState>(set => ({
  transaksi: null,
  loading: false,
  processing: false,
  error: '',
  success: '',

  fetchTransaksiDetail: async (id: string) => {
    try {
      set({ loading: true, error: '', success: '' });
      const data = await getTransaksiDetail(id);
      set({ transaksi: data, loading: false });
    } catch (error) {
      console.error('Gagal mengambil data transaksi:', error);
      set({ error: 'Gagal mengambil data transaksi', loading: false });
    }
  },

  handleSelesaikan: async (id: string) => {
    try {
      set({ processing: true, error: '', success: '' });
      await selesaikanTransaksi(id);

      const data = await getTransaksiDetail(id);
      set({
        transaksi: data,
        success: 'Transaksi berhasil diselesaikan',
        processing: false,
      });
    } catch (error) {
      console.error('Gagal menyelesaikan transaksi:', error);
      set({
        error: 'Gagal menyelesaikan transaksi',
        processing: false,
      });
    }
  },

  resetMessages: () => {
    set({ error: '', success: '' });
  },

  getStatusBadgeClass: (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case StatusTransaksi.BERJALAN:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case StatusTransaksi.SELESAI:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case StatusTransaksi.BATAL:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400';
      case StatusTransaksi.OVERDUE:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400';
    }
  },

  safeDateFormat: (
    dateString: string | null | undefined,
    formatter: DateFormatter
  ) => {
    if (!dateString) return '-';
    try {
      return formatter(dateString);
    } catch (error) {
      console.error('Format tanggal error:', error);
      return '-';
    }
  },
}));

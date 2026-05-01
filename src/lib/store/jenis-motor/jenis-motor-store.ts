import { deleteJenisMotor, getJenisMotor } from '@/lib/jenis-motor';
import { JenisMotor } from '@/lib/types/jenis-motor';
import { create } from 'zustand';

interface JenisMotorState {
  data: JenisMotor[];
  filteredData: JenisMotor[];
  loading: boolean;
  error: string;
  success: string;
  searchQuery: string;
  showDeleteDialog: boolean;
  jenisToDelete: string | null;

  fetchJenisMotor: () => Promise<void>;
  handleSearch: (e: React.FormEvent) => void;
  setSearchQuery: (query: string) => void;
  resetSearch: () => void;
  confirmDelete: (id: string) => void;
  cancelDelete: () => void;
  deleteJenis: () => Promise<void>;
}

export const useJenisMotorStore = create<JenisMotorState>((set, get) => ({
  data: [],
  filteredData: [],
  loading: false,
  error: '',
  success: '',
  searchQuery: '',
  showDeleteDialog: false,
  jenisToDelete: null,

  fetchJenisMotor: async () => {
    try {
      set({ loading: true, error: '', success: '' });
      const jenisMotorData = await getJenisMotor();

      console.log('Store received jenis motor data:', jenisMotorData);
      console.log('Data type:', typeof jenisMotorData);
      console.log('Is array:', Array.isArray(jenisMotorData));
      console.log('Data length:', jenisMotorData?.length);

      // getJenisMotor() returns JenisMotor[] directly
      set({
        data: jenisMotorData || [],
        filteredData: jenisMotorData || [],
        loading: false,
      });
    } catch (error) {
      console.error('Gagal mengambil data jenis motor:', error);
      set({
        error: 'Gagal mengambil data jenis motor',
        loading: false,
      });
    }
  },

  handleSearch: (e: React.FormEvent) => {
    e.preventDefault();
    const { data, searchQuery } = get();

    if (!searchQuery) {
      set({ filteredData: data });
      return;
    }

    const filtered = data.filter(
      jenis =>
        jenis.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jenis.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${jenis.merk} ${jenis.model}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    set({ filteredData: filtered });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  resetSearch: () => {
    set({ searchQuery: '', filteredData: get().data });
  },

  confirmDelete: (id: string) => {
    set({ jenisToDelete: id, showDeleteDialog: true });
  },

  cancelDelete: () => {
    set({ jenisToDelete: null, showDeleteDialog: false });
  },

  deleteJenis: async () => {
    const { jenisToDelete, fetchJenisMotor } = get();

    if (!jenisToDelete) return;

    try {
      set({ loading: true, error: '', success: '' });
      await deleteJenisMotor(jenisToDelete);
      set({
        success: 'Jenis motor berhasil dihapus',
        showDeleteDialog: false,
        jenisToDelete: null,
      });
      await fetchJenisMotor();
    } catch (error) {
      console.error('Gagal menghapus jenis motor:', error);
      set({
        error: 'Gagal menghapus jenis motor',
        loading: false,
        showDeleteDialog: false,
        jenisToDelete: null,
      });
    }
  },
}));

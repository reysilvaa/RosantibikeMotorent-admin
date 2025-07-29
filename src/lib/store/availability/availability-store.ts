import { checkAvailability } from '@/lib/api/availability';
import { UnitMotor } from '@/lib/types/unit-motor';
import { create } from 'zustand';

interface AvailabilityState {
  loading: boolean;
  error: string | null;
  units: UnitMotor[];
  selectedDate: Date;
  selectedJenisId: string | null;
  jamMulai: string | null;
  jamSelesai: string | null;
  setSelectedDate: (date: Date) => void;
  setSelectedJenisId: (id: string | null) => void;
  setJamMulai: (jam: string | null) => void;
  setJamSelesai: (jam: string | null) => void;
  fetchAvailability: (date: Date) => Promise<void>;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  loading: false,
  error: null,
  units: [],
  selectedDate: new Date(),
  selectedJenisId: null,
  jamMulai: null,
  jamSelesai: null,

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  setSelectedJenisId: (id: string | null) => {
    set({ selectedJenisId: id });
  },

  setJamMulai: (jam: string | null) => {
    set({ jamMulai: jam });
  },

  setJamSelesai: (jam: string | null) => {
    set({ jamSelesai: jam });
  },

  fetchAvailability: async (date: Date) => {
    try {
      set({ loading: true, error: null });

      // Format date untuk API call
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const state = get();
      const response = await checkAvailability({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        jenisId: state.selectedJenisId || undefined,
        jamMulai: state.jamMulai || undefined,
        jamSelesai: state.jamSelesai || undefined,
      });

      if (response.success) {
        set({ 
          units: response.data,
          loading: false 
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Gagal memuat data availability',
        loading: false 
      });
    }
  },
}));

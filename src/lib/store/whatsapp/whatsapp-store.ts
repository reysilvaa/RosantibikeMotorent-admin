import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';
import {
  getWhatsAppQrCode,
  getWhatsAppStatus,
  logoutWhatsAppSession,
  resetWhatsAppConnection,
  startAllWhatsAppSessions,
} from '@/lib/api/whatsapp';
import { WhatsAppStatus } from '@/lib/types/whatsapp';

export interface WhatsAppState {
  status: WhatsAppStatus;
  qrCode: string;
  qrError: string;
  qrLoading: boolean;
  loading: boolean;
  refreshing: boolean;
  qrLastUpdated: Date | null;

  fetchStatus: () => Promise<void>;
  fetchQrCode: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleStart: () => Promise<void>;

  setStatus: (status: WhatsAppStatus) => void;
  setQrCode: (qrCode: string) => void;
  setQrError: (error: string) => void;
  setQrLoading: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setQrLastUpdated: (date: Date | null) => void;
}

export const useWhatsAppStore = create<WhatsAppState>((set, get) => ({
  status: {
    connected: false,
    state: 'DISCONNECTED',
    message: '',
  },
  qrCode: '',
  qrError: '',
  qrLoading: false,
  loading: true,
  refreshing: false,
  qrLastUpdated: null,

  setStatus: status => set({ status }),
  setQrCode: qrCode => set({ qrCode }),
  setQrError: qrError => set({ qrError }),
  setQrLoading: qrLoading => set({ qrLoading }),
  setLoading: loading => set({ loading }),
  setRefreshing: refreshing => set({ refreshing }),
  setQrLastUpdated: qrLastUpdated => set({ qrLastUpdated }),

  fetchStatus: async () => {
    try {
      const statusResponse = await getWhatsAppStatus();

      const mergedStatus = {
        connected: statusResponse.connected,
        state: String(statusResponse.state || 'UNKNOWN'),
        message: String(statusResponse.message || ''),
      };

      set({ status: mergedStatus });
      if (!mergedStatus.connected) {
        get().fetchQrCode();
      } else {
        set({ qrCode: '', qrError: '' });
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil status WhatsApp',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchQrCode: async () => {
    const { qrLoading } = get();
    if (qrLoading) return;

    try {
      set({ qrLoading: true, qrError: '' });

      const response = await getWhatsAppQrCode();
      console.log('QR code response:', response);

      if (
        response &&
        response.status === 'success' &&
        'qrCode' in response &&
        response.qrCode
      ) {
        set({ qrCode: response.qrCode, qrLastUpdated: new Date() });
        console.log('QR code ditemukan di properti qrCode');
      } else if (
        response &&
        response.status === 'success' &&
        response.data &&
        typeof response.data === 'string' &&
        response.data.startsWith('data:image')
      ) {
        set({ qrCode: response.data, qrLastUpdated: new Date() });
        console.log('QR code terdeteksi dalam format base64 di properti data');

        if (
          response.message &&
          response.message.includes('QR code tidak tersedia')
        ) {
          console.log(
            'Mengabaikan pesan error karena QR code ditemukan di properti data'
          );
        }
      } else if (
        response &&
        response.status === 'success' &&
        ('connected' in response ||
          (response.message && response.message.includes('terhubung')))
      ) {
        set({
          qrCode: '',
          qrLastUpdated: null,
          qrError: 'WhatsApp sudah terhubung, tidak perlu QR code',
          status: { ...get().status, connected: true },
        });
        get().fetchStatus();
      } else if (response && response.status === 'info') {
        set({ qrCode: '', qrLastUpdated: null });
        const infoMessage =
          typeof response.message === 'string'
            ? response.message
            : 'Sedang memproses koneksi, QR code akan segera tersedia';
        set({ qrError: infoMessage });
      } else if (
        response &&
        response.status === 'success' &&
        response.message
      ) {
        set({ qrCode: '', qrLastUpdated: null });
        set({ qrError: response.message });

        if (
          response.message.includes('sedang diproses') ||
          response.message.includes('menunggu') ||
          response.message.includes('connecting')
        ) {
          setTimeout(() => {
            get().fetchStatus();
          }, 5000);
        }
      } else {
        set({ qrCode: '', qrLastUpdated: null });
        const errorMessage =
          typeof response?.message === 'string'
            ? response.message
            : 'QR code belum siap. Coba lagi dalam beberapa saat.';
        set({ qrError: errorMessage });
      }
    } catch (error: unknown) {
      console.error('Error fetching QR code:', error);
      set({ qrCode: '', qrLastUpdated: null });

      if (error instanceof Error) {
        if (error.message.includes('QR code tidak tersedia')) {
          set({
            qrError:
              'QR code tidak tersedia. WhatsApp mungkin sudah terhubung atau sedang mempersiapkan koneksi.',
          });
        } else if (error.message.includes('Network Error')) {
          set({
            qrError:
              'Gagal terhubung ke server WhatsApp. Periksa koneksi jaringan Anda.',
          });
        } else if (error.message.includes('timeout')) {
          set({
            qrError:
              'Permintaan timeout. Server WhatsApp mungkin sibuk, coba lagi nanti.',
          });
        } else {
          set({ qrError: `Error: ${error.message}` });
        }
      } else {
        set({
          qrError:
            'Gagal memuat QR code. Coba reset koneksi atau mulai sesi baru.',
        });
      }
    } finally {
      set({ qrLoading: false });
    }
  },

  handleRefresh: async () => {
    set({ refreshing: true, qrError: '' });

    try {
      const response = await resetWhatsAppConnection();
      console.log('Reset connection response:', response);

      const isSuccess =
        response &&
        (response.status === 'success' ||
          (typeof response.message === 'string' &&
            (response.message.includes('berhasil') ||
              response.message.includes('success'))));

      if (isSuccess) {
        toast({
          title: 'Berhasil',
          description: 'Koneksi WhatsApp sedang di-reset',
        });
      } else {
        toast({
          title: 'Informasi',
          description: response?.message || 'Proses reset sedang berlangsung',
        });
      }

      // Polling QR code setiap 2 detik selama 10 detik
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = setInterval(() => {
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          set({ refreshing: false });
          return;
        }
        
        attempts++;
        console.log(`Polling QR code attempt ${attempts}/${maxAttempts}`);
        get().fetchQrCode();
        
        if (attempts === maxAttempts) {
          get().fetchStatus();
          set({ refreshing: false });
        }
      }, 2000);
    } catch (error) {
      console.error('Error resetting connection:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? `Gagal mereset koneksi: ${error.message}`
            : 'Gagal mereset koneksi WhatsApp',
        variant: 'destructive',
      });
      set({ refreshing: false });
    }
  },

  handleLogout: async () => {
    set({ refreshing: true, qrError: '' });

    try {
      const response = await logoutWhatsAppSession();
      console.log('Logout response:', response);
      
      const isSuccess =
        response &&
        (response.status === 'success' ||
          (typeof response.message === 'string' &&
            (response.message.includes('berhasil') ||
              response.message.includes('success'))));

      if (isSuccess) {
        toast({
          title: 'Berhasil',
          description: 'Berhasil logout dari WhatsApp',
        });
      } else {
        toast({
          title: 'Informasi',
          description: response?.message || 'Proses logout sedang berlangsung',
        });
      }

      // Polling status setiap 2 detik selama 10 detik
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = setInterval(() => {
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          set({ refreshing: false });
          return;
        }
        
        attempts++;
        console.log(`Polling status after logout attempt ${attempts}/${maxAttempts}`);
        get().fetchStatus();
        
        if (attempts === maxAttempts) {
          set({ refreshing: false });
        }
      }, 2000);
    } catch (error: unknown) {
      console.error('Error logging out:', error);
      
      let errorMessage = 'Gagal logout dari WhatsApp';
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          errorMessage = 'Endpoint logout tidak ditemukan. Server mungkin belum mendukung fitur ini.';
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Gagal terhubung ke server WhatsApp. Periksa koneksi jaringan Anda.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Permintaan timeout. Server WhatsApp mungkin sibuk, coba lagi nanti.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      set({ refreshing: false });
    }
  },

  handleStart: async () => {
    set({ refreshing: true, qrError: '' });

    try {
      const response = await startAllWhatsAppSessions();
      console.log('Start session response:', response);

      const isSuccess =
        response &&
        (response.status === 'success' ||
          (typeof response.message === 'string' &&
            (response.message.includes('berhasil') ||
              response.message.includes('success'))));

      if (isSuccess) {
        toast({
          title: 'Berhasil',
          description: 'Berhasil memulai sesi WhatsApp',
        });
      } else {
        toast({
          title: 'Informasi',
          description:
            response?.message || 'Proses memulai sesi sedang berlangsung',
        });
      }

      // Polling QR code setiap 2 detik selama 10 detik
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = setInterval(() => {
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          set({ refreshing: false });
          return;
        }
        
        attempts++;
        console.log(`Polling QR code attempt ${attempts}/${maxAttempts}`);
        get().fetchQrCode();
        
        if (attempts === maxAttempts) {
          get().fetchStatus();
          set({ refreshing: false });
        }
      }, 2000);
    } catch (error: unknown) {
      console.error('Error starting session:', error);
      let errorMessage = 'Gagal memulai sesi WhatsApp';

      if (error instanceof Error) {
        if (error.message.includes('Invalid response format')) {
          errorMessage =
            'Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah dengan layanan WhatsApp. Silakan coba lagi nanti.';
        } else if (error.message.includes('Network Error')) {
          errorMessage =
            'Gagal terhubung ke server WhatsApp. Periksa koneksi jaringan Anda.';
        } else if (error.message.includes('timeout')) {
          errorMessage =
            'Permintaan timeout. Server WhatsApp mungkin sibuk, coba lagi nanti.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      set({ refreshing: false });
    }
  },
}));

import { create } from 'zustand';
import { 
  getWhatsAppStatus, 
  getWhatsAppQrCode, 
  resetWhatsAppConnection, 
  logoutWhatsAppSession, 
  startAllWhatsAppSessions 
} from '@/lib/api/whatsapp';
import { toast } from '@/components/ui/use-toast';
import { WhatsAppStatus } from '@/lib/types/whatsapp';

export interface WhatsAppState {
  // Status
  status: WhatsAppStatus;
  qrCode: string;
  qrError: string;
  qrLoading: boolean;
  loading: boolean;
  refreshing: boolean;
  qrLastUpdated: Date | null;

  // Actions
  fetchStatus: () => Promise<void>;
  fetchQrCode: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleStart: () => Promise<void>;
  
  // Setters
  setStatus: (status: WhatsAppStatus) => void;
  setQrCode: (qrCode: string) => void;
  setQrError: (error: string) => void;
  setQrLoading: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setQrLastUpdated: (date: Date | null) => void;
}

export const useWhatsAppStore = create<WhatsAppState>((set, get) => ({
  // Status
  status: {
    connected: false,
    state: "DISCONNECTED",
    message: "",
  },
  qrCode: "",
  qrError: "",
  qrLoading: false,
  loading: true,
  refreshing: false,
  qrLastUpdated: null,

  // Setters
  setStatus: (status) => set({ status }),
  setQrCode: (qrCode) => set({ qrCode }),
  setQrError: (qrError) => set({ qrError }),
  setQrLoading: (qrLoading) => set({ qrLoading }),
  setLoading: (loading) => set({ loading }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setQrLastUpdated: (qrLastUpdated) => set({ qrLastUpdated }),

  // Actions
  fetchStatus: async () => {
    try {
      // Ambil status koneksi dari endpoint status
      const statusResponse = await getWhatsAppStatus();
      
      // Gabungkan informasi dari endpoint untuk status yang akurat
      const mergedStatus = {
        connected: statusResponse.connected,
        state: String(statusResponse.state || 'UNKNOWN'),
        message: String(statusResponse.message || ''),
      };
      
      set({ status: mergedStatus });
      if (!mergedStatus.connected) {
        get().fetchQrCode();
      } else {
        // Jika terhubung, hapus QR code
        set({ qrCode: "", qrError: "" });
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil status WhatsApp",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchQrCode: async () => {
    const { qrLoading } = get();
    if (qrLoading) return; // Hindari permintaan bersamaan
    
    try {
      set({ qrLoading: true, qrError: "" });
      
      const response = await getWhatsAppQrCode();
      console.log("QR code response:", response);
      
      // Berhasil mendapatkan QR code dari properti qrCode
      if (response && response.status === 'success' && 'qrCode' in response && response.qrCode) {
        set({ qrCode: response.qrCode, qrLastUpdated: new Date() });
        console.log("QR code ditemukan di properti qrCode");
      } 
      // Penanganan QR code dalam format base64 di properti data (format alternatif)
      else if (response && response.status === 'success' && response.data && 
              (typeof response.data === 'string' && response.data.startsWith('data:image'))) {
        // Respons memiliki QR code dalam format base64 di field data
        set({ qrCode: response.data, qrLastUpdated: new Date() });
        console.log("QR code terdeteksi dalam format base64 di properti data");
        
        // Jika ada pesan error tentang QR code tidak tersedia, abaikan karena QR code sebenarnya ada
        if (response.message && response.message.includes("QR code tidak tersedia")) {
          console.log("Mengabaikan pesan error karena QR code ditemukan di properti data");
        }
      }
      // WhatsApp sudah terhubung
      else if (response && response.status === 'success' && (
        'connected' in response || 
        (response.message && response.message.includes('terhubung'))
      )) {
        set({ 
          qrCode: "", 
          qrLastUpdated: null, 
          qrError: "WhatsApp sudah terhubung, tidak perlu QR code",
          status: { ...get().status, connected: true }
        });
        get().fetchStatus(); // Perbarui status
      }
      // Proses koneksi sedang berlangsung
      else if (response && response.status === 'info') {
        set({ qrCode: "", qrLastUpdated: null });
        const infoMessage = typeof response.message === 'string' 
          ? response.message 
          : "Sedang memproses koneksi, QR code akan segera tersedia";
        set({ qrError: infoMessage });
      }
      // Handle kasus di mana status 'success' tapi tidak ada QR code dan server mengembalikan pesan
      else if (response && response.status === 'success' && response.message) {
        set({ qrCode: "", qrLastUpdated: null });
        set({ qrError: response.message });
        
        // Jika koneksi sedang berlangsung, jadwalkan pemeriksaan status
        if (response.message.includes('sedang diproses') || 
            response.message.includes('menunggu') ||
            response.message.includes('connecting')) {
          setTimeout(() => {
            get().fetchStatus();
          }, 5000); // Cek lagi setelah 5 detik
        }
      }
      // Error atau QR code belum tersedia
      else {
        set({ qrCode: "", qrLastUpdated: null });
        const errorMessage = typeof response?.message === 'string'
          ? response.message
          : "QR code belum siap. Coba lagi dalam beberapa saat.";
        set({ qrError: errorMessage });
      }
    } catch (error: unknown) {
      console.error("Error fetching QR code:", error);
      set({ qrCode: "", qrLastUpdated: null });
      
      // Tangani pesan error secara khusus
      if (error instanceof Error) {
        if (error.message.includes("QR code tidak tersedia")) {
          set({ qrError: "QR code tidak tersedia. WhatsApp mungkin sudah terhubung atau sedang mempersiapkan koneksi." });
        } else if (error.message.includes("Network Error")) {
          set({ qrError: "Gagal terhubung ke server WhatsApp. Periksa koneksi jaringan Anda." });
        } else if (error.message.includes("timeout")) {
          set({ qrError: "Permintaan timeout. Server WhatsApp mungkin sibuk, coba lagi nanti." });
        } else {
          set({ qrError: `Error: ${error.message}` });
        }
      } else {
        set({ qrError: "Gagal memuat QR code. Coba reset koneksi atau mulai sesi baru." });
      }
    } finally {
      set({ qrLoading: false });
    }
  },

  handleRefresh: async () => {
    set({ refreshing: true, qrError: "" });
    
    try {
      const response = await resetWhatsAppConnection();
      console.log("Reset connection response:", response);
      
      // Cek apakah reset berhasil berdasarkan pesan respons
      const isSuccess = response && 
        (response.status === 'success' || 
         (typeof response.message === 'string' && 
          (response.message.includes('berhasil') || 
           response.message.includes('success'))));
      
      if (isSuccess) {
        toast({
          title: "Berhasil",
          description: "Koneksi WhatsApp sedang di-reset",
        });
      } else {
        toast({
          title: "Informasi",
          description: response?.message || "Proses reset sedang berlangsung",
        });
      }
      
      // Tunggu sedikit sebelum memeriksa status baru
      setTimeout(() => {
        get().fetchStatus();
        set({ refreshing: false });
      }, 3000);
    } catch (error) {
      console.error("Error resetting connection:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Gagal mereset koneksi: ${error.message}` 
          : "Gagal mereset koneksi WhatsApp",
        variant: "destructive",
      });
      set({ refreshing: false });
    }
  },

  handleLogout: async () => {
    if (!window.confirm("Apakah Anda yakin ingin logout dari sesi WhatsApp?")) {
      return;
    }
    
    set({ refreshing: true, qrError: "" });
    
    try {
      await logoutWhatsAppSession();
      toast({
        title: "Berhasil",
        description: "Berhasil logout dari WhatsApp",
      });
      
      setTimeout(() => {
        get().fetchStatus();
        set({ refreshing: false });
      }, 3000);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Gagal logout dari WhatsApp",
        variant: "destructive",
      });
      set({ refreshing: false });
    }
  },

  handleStart: async () => {
    set({ refreshing: true, qrError: "" });
    
    try {
      const response = await startAllWhatsAppSessions();
      console.log("Start session response:", response);
      
      // Verifikasi apakah sesi berhasil dimulai berdasarkan respons
      const isSuccess = response && 
        (response.status === 'success' || 
         (typeof response.message === 'string' && 
          (response.message.includes('berhasil') || 
           response.message.includes('success'))));
      
      if (isSuccess) {
        toast({
          title: "Berhasil",
          description: "Berhasil memulai sesi WhatsApp",
        });
      } else {
        toast({
          title: "Informasi",
          description: response?.message || "Proses memulai sesi sedang berlangsung",
        });
      }
      
      setTimeout(() => {
        get().fetchStatus();
        set({ refreshing: false });
      }, 3000);
    } catch (error: unknown) {
      console.error("Error starting session:", error);
      let errorMessage = "Gagal memulai sesi WhatsApp";
      
      // Cek pesan error khusus
      if (error instanceof Error) {
        if (error.message.includes("Invalid response format")) {
          errorMessage = "Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah dengan layanan WhatsApp. Silakan coba lagi nanti.";
        } else if (error.message.includes("Network Error")) {
          errorMessage = "Gagal terhubung ke server WhatsApp. Periksa koneksi jaringan Anda.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Permintaan timeout. Server WhatsApp mungkin sibuk, coba lagi nanti.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      set({ refreshing: false });
    }
  },
})); 
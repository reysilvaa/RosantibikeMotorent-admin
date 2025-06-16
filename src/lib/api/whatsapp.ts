import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';

// Fungsi untuk mendapatkan status WhatsApp
export const getWhatsAppStatus = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Normalisasi format respons
    return {
      connected: response.data.connected || 
                 response.data.status === 'success' || 
                 response.data.data?.connected || 
                 response.data.data?.status === 'CONNECTED',
      state: response.data.state || response.data.data?.state || 'UNKNOWN',
      message: response.data.message || response.data.data?.message || '',
    };
  } catch (error: any) {
    console.error("Error fetching WhatsApp status:", error);
    return {
      connected: false,
      state: 'ERROR',
      message: error instanceof Error ? error.message : 'Gagal mengambil status WhatsApp',
    };
  }
};

// Fungsi untuk mendapatkan status sesi WhatsApp
export const getWhatsAppSessionStatus = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/session-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching WhatsApp session status:", error);
    return {
      status: 'error',
      data: {
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Gagal mengambil status sesi WhatsApp',
      }
    };
  }
};

// Fungsi untuk mendapatkan QR code WhatsApp
export const getWhatsAppQrCode = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/qr-code`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching WhatsApp QR code:", error);
    // Jika error adalah karena QR code tidak tersedia (404), kita tangani secara khusus
    if (error instanceof Error && 
        (error.message.includes('QR code tidak tersedia') || 
         error.message.includes('tidak tersedia') || 
         error.message.includes('Not Found'))) {
      return {
        status: 'info',
        message: 'QR code tidak tersedia. WhatsApp mungkin sudah terhubung atau belum siap.',
      };
    }
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Gagal mengambil QR code WhatsApp',
    };
  }
};

// Fungsi untuk reset koneksi WhatsApp
export const resetWhatsAppConnection = async () => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/whatsapp/reset`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error resetting WhatsApp connection:", error);
    throw error;
  }
};

// Fungsi untuk logout sesi WhatsApp
export const logoutWhatsAppSession = async () => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/whatsapp/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error logging out WhatsApp session:", error);
    throw error;
  }
};

// Fungsi untuk memulai semua sesi WhatsApp
export const startAllWhatsAppSessions = async () => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/whatsapp/start-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error starting WhatsApp sessions:", error);
    // Jika terjadi error "Invalid response format", tambahkan pesan yang lebih jelas
    if (error instanceof Error && error.message.includes('Invalid response format')) {
      throw new Error("Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah pada layanan WhatsApp backend.");
    }
    throw error;
  }
};

// Fungsi untuk mendapatkan semua sesi WhatsApp
export const getAllWhatsAppSessions = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/all-sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting WhatsApp sessions:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan chat WhatsApp
export const getWhatsAppChats = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting WhatsApp chats:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan pesan WhatsApp
export const getWhatsAppMessages = async (phone: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/messages/${phone}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting WhatsApp messages:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan kontak WhatsApp
export const getWhatsAppContact = async (phone: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/whatsapp/contact/${phone}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting WhatsApp contact:", error);
    throw error;
  }
};

// Fungsi untuk mengirim pesan WhatsApp
export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/whatsapp/send`, { to, message }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

// Fungsi untuk mengirim pesan WhatsApp ke admin
export const sendWhatsAppMessageToAdmin = async (message: string) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/whatsapp/send-admin`, { message }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error sending WhatsApp message to admin:", error);
    throw error;
  }
}; 
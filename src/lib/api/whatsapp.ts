import axios from '../axios';

export const getWhatsAppStatus = async () => {
  try {
    const response = await axios.get(`/whatsapp/status`);
    return {
      connected: response.data.connected || 
                 response.data.status === 'success' || 
                 response.data.data?.connected || 
                 response.data.data?.status === 'CONNECTED',
      state: response.data.state || response.data.data?.state || 'UNKNOWN',
      message: response.data.message || response.data.data?.message || '',
    };
  } catch (error: unknown) {
    console.error("Error fetching WhatsApp status:", error);
    return {
      connected: false,
      state: 'ERROR',
      message: error instanceof Error ? error.message : 'Gagal mengambil status WhatsApp',
    };
  }
};

export const getWhatsAppSessionStatus = async () => {
  try {
    const response = await axios.get(`/whatsapp/session-status`);
    return response.data;
  } catch (error: unknown) {
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

export const getWhatsAppQrCode = async () => {
  try {
    const response = await axios.get(`/whatsapp/qr-code`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching WhatsApp QR code:", error);
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

export const resetWhatsAppConnection = async () => {
  try {
    const response = await axios.post(`/whatsapp/reset`, {});
    return response.data;
  } catch (error: unknown) {
    console.error("Error resetting WhatsApp connection:", error);
    throw error;
  }
};

export const logoutWhatsAppSession = async () => {
  try {
    const response = await axios.post(`/whatsapp/logout`, {});
    return response.data;
  } catch (error: unknown) {
    console.error("Error logging out WhatsApp session:", error);
    throw error;
  }
};

export const startAllWhatsAppSessions = async () => {
  try {
    const response = await axios.post(`/whatsapp/start-all`, {});
    return response.data;
  } catch (error: unknown) {
    console.error("Error starting WhatsApp sessions:", error);
    if (error instanceof Error && error.message.includes('Invalid response format')) {
      throw new Error("Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah pada layanan WhatsApp backend.");
    }
    throw error;
  }
};

export const getAllWhatsAppSessions = async () => {
  try {
    const response = await axios.get(`/whatsapp/all-sessions`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting WhatsApp sessions:", error);
    throw error;
  }
};

export const getWhatsAppChats = async () => {
  try {
    const response = await axios.get(`/whatsapp/chats`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting WhatsApp chats:", error);
    throw error;
  }
};

export const getWhatsAppMessages = async (phone: string) => {
  try {
    const response = await axios.get(`/whatsapp/messages/${phone}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting WhatsApp messages:", error);
    throw error;
  }
};

export const getWhatsAppContact = async (phone: string) => {
  try {
    const response = await axios.get(`/whatsapp/contact/${phone}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting WhatsApp contact:", error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const response = await axios.post(`/whatsapp/send`, { to, message });
    return response.data;
  } catch (error: unknown) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

export const sendWhatsAppMessageToAdmin = async (message: string) => {
  try {
    const response = await axios.post(`/whatsapp/send-admin`, { message });
    return response.data;
  } catch (error: unknown) {
    console.error("Error sending WhatsApp message to admin:", error);
    throw error;
  }
}; 
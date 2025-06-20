import axios from '../axios';
import { WhatsAppQrCodeResponse, WhatsAppStatus } from '../types/whatsapp';

export const getWhatsAppStatus = async (): Promise<WhatsAppStatus> => {
  try {
    const response = await axios.get('/whatsapp/session-status');

    return {
      connected:
        response.data.connected ||
        response.data.status === 'CONNECTED' ||
        response.data.data?.connected === true,
      state: response.data.state || response.data.status || 'DISCONNECTED',
      message: response.data.message || '',
    };
  } catch (error: unknown) {
    console.error('Error fetching WhatsApp status:', error);
    return {
      connected: false,
      state: 'ERROR',
      message:
        error instanceof Error
          ? error.message
          : 'Gagal mengambil status WhatsApp',
    };
  }
};

export const getWhatsAppQrCode = async (): Promise<WhatsAppQrCodeResponse> => {
  try {
    const response = await axios.get('/whatsapp/qrcode');

    if (response.status === 200) {
      if (
        typeof response.data === 'string' &&
        response.data.startsWith('data:image')
      ) {
        return {
          status: 'success',
          qrCode: response.data,
        };
      }

      if (typeof response.data === 'object') {
        if (response.data.qrCode) {
          return { status: 'success', qrCode: response.data.qrCode };
        }

        if (response.data.qrcode) {
          return { status: 'success', qrCode: response.data.qrcode };
        }

        if (response.data.data?.qrcode) {
          return { status: 'success', qrCode: response.data.data.qrcode };
        }

        if (
          response.data.connected === true ||
          response.data.status === 'CONNECTED'
        ) {
          return {
            status: 'success',
            connected: true,
            message: 'WhatsApp sudah terhubung',
          };
        }

        if (response.data.message) {
          return {
            status: 'success',
            message: response.data.message,
          };
        }
      }

      return {
        status: 'success',
        message: 'QR code tidak tersedia saat ini',
        data:
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data),
      };
    }

    return {
      status: 'error',
      message: 'Format respons tidak dikenali',
    };
  } catch (error: unknown) {
    console.error('Error fetching WhatsApp QR code:', error);
    return {
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Gagal mengambil QR code WhatsApp',
    };
  }
};

export const resetWhatsAppConnection = async () => {
  try {
    try {
      const response = await axios.post('/whatsapp/reset-connection', {});
      return response.data;
    } catch (resetError) {
      if (
        resetError instanceof Error &&
        (resetError.message.includes('404') ||
          resetError.message.includes('Not Found'))
      ) {
        const response = await axios.post('/whatsapp/reconnect', {});
        return response.data;
      }
      throw resetError;
    }
  } catch (error: unknown) {
    console.error('Error resetting WhatsApp connection:', error);
    throw error;
  }
};

export const logoutWhatsAppSession = async () => {
  try {
    const response = await axios.post('/whatsapp/logout', {});
    return response.data;
  } catch (error: unknown) {
    console.error('Error logging out WhatsApp session:', error);
    throw error;
  }
};

export const startAllWhatsAppSessions = async () => {
  try {
    try {
      const response = await axios.post('/whatsapp/start-all', {});
      return response.data;
    } catch (startError) {
      if (
        startError instanceof Error &&
        (startError.message.includes('404') ||
          startError.message.includes('Not Found'))
      ) {
        const response = await axios.post('/whatsapp/connect', {});
        return response.data;
      }
      throw startError;
    }
  } catch (error: unknown) {
    console.error('Error starting WhatsApp sessions:', error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (to: string, message: string) => {
  if (!to || typeof to !== 'string') {
    throw new Error('Nomor tujuan tidak valid');
  }
  if (!message || typeof message !== 'string') {
    throw new Error('Pesan tidak valid');
  }

  try {
    const response = await axios.post('/whatsapp/send-message', {
      to,
      message,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const sendWhatsAppMessageToAdmin = async (message: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Pesan tidak valid');
  }

  try {
    const response = await axios.post('/whatsapp/send-to-admin', { message });
    return response.data;
  } catch (error: unknown) {
    console.error('Error sending WhatsApp message to admin:', error);
    throw error;
  }
};

export const getAllWhatsAppSessions = async () => {
  try {
    try {
      const response = await axios.get('/whatsapp/all-sessions');
      return response.data;
    } catch (sessionError) {
      if (
        sessionError instanceof Error &&
        (sessionError.message.includes('404') ||
          sessionError.message.includes('Not Found'))
      ) {
        console.log(
          'Endpoint all-sessions tidak ditemukan, menggunakan endpoint session-status'
        );
        const response = await axios.get('/whatsapp/session-status');
        return response.data;
      }
      throw sessionError;
    }
  } catch (error: unknown) {
    console.error('Error getting WhatsApp sessions:', error);
    throw error;
  }
};

export const getWhatsAppChats = async () => {
  try {
    const response = await axios.get('/whatsapp/chats');
    return response.data;
  } catch (error: unknown) {
    console.error('Error getting WhatsApp chats:', error);
    throw error;
  }
};

export const getWhatsAppMessages = async (phone: string) => {
  try {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Nomor telepon tidak valid');
    }
    const response = await axios.get(`/whatsapp/messages/${phone}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error getting WhatsApp messages:', error);
    throw error;
  }
};

export const getWhatsAppContact = async (phone: string) => {
  try {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Nomor telepon tidak valid');
    }
    const response = await axios.get(`/whatsapp/contact/${phone}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error getting WhatsApp contact:', error);
    throw error;
  }
};

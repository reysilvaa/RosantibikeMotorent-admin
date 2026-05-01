import axios from 'axios';
import axiosInstance from '../axios';
import { WhatsAppQrCodeResponse, WhatsAppStatus } from '../types/whatsapp';

export const getWhatsAppStatus = async (): Promise<WhatsAppStatus> => {
  try {
    const response = await axiosInstance.get('/whatsapp/status');

    return {
      connected:
        response.data.data?.isConnected === true ||
        response.data.data?.connected === true ||
        response.data.status === 'CONNECTED',
      state: response.data.data?.status?.state || response.data.status || 'DISCONNECTED',
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
    const response = await axiosInstance.get('/whatsapp/qrcode');

    if (response.status === 200) {
      // Jika respons adalah gambar langsung
      if (
        typeof response.data === 'string' &&
        response.data.startsWith('data:image')
      ) {
        return {
          status: 'success',
          qrCode: response.data,
        };
      }

      // Jika respons adalah objek JSON
      if (typeof response.data === 'object') {
        // Cek berbagai format respons yang mungkin
        if (response.data.qrcode) {
          return { status: 'success', qrCode: response.data.qrcode };
        }

        if (response.data.qrCode) {
          return { status: 'success', qrCode: response.data.qrCode };
        }

        if (response.data.data?.qrcode) {
          return { status: 'success', qrCode: response.data.data.qrcode };
        }

        // Menangani format respons dari server
        if (response.data.data && typeof response.data.data === 'string') {
          try {
            // Cek apakah data berisi JSON dengan property code
            if (response.data.data.includes('code')) {
              return {
                status: 'success',
                data: response.data.data,
              };
            }
          } catch (parseError) {
            console.error('Error parsing code data:', parseError);
          }
        }

        // Jika WhatsApp sudah terhubung
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

        // Jika ada pesan
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
    // Coba endpoint reset terlebih dahulu
    try {
      const response = await axiosInstance.post('/whatsapp/reset');
      console.log('Reset koneksi berhasil:', response.data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Reset koneksi gagal, mencoba metode lain...', errorMessage);

      // Jika gagal, coba connect
      try {
        const response = await axiosInstance.post('/whatsapp/connect');
        console.log('Connect berhasil:', response.data);
        return response.data;
      } catch (connectError) {
        console.error('Connect juga gagal:', connectError);
        throw connectError;
      }
    }
  } catch (error: unknown) {
    console.error('Error resetting WhatsApp connection:', error);
    throw error;
  }
};

export const logoutWhatsAppSession = async () => {
  try {
    // Mencoba endpoint logout
    try {
      const response = await axiosInstance.post('/whatsapp/logout');
      console.log('Logout berhasil:', response.data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Logout gagal:', errorMessage);
      
      // Jika gagal, coba reset sebagai alternatif
      try {
        const response = await axiosInstance.post('/whatsapp/reset');
        console.log('Reset sebagai alternatif logout berhasil:', response.data);
        return response.data;
      } catch (resetError) {
        console.error('Reset juga gagal:', resetError);
        throw resetError;
      }
    }
  } catch (error: unknown) {
    console.error('Error logging out WhatsApp session:', error);
    throw error;
  }
};

export const startAllWhatsAppSessions = async () => {
  try {
    const response = await axiosInstance.post('/whatsapp/connect');
    return response.data;
  } catch (error: unknown) {
    console.error('Error starting WhatsApp sessions:', error);
    throw error;
  }
};

export const detectPhoneNumberFormat = async (phone: string): Promise<string | null> => {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  try {
    // Bersihkan nomor dari karakter non-digit
    let cleaned = phone.replace(/\D/g, '');
    
    // Format yang akan dicoba
    const formats = [
      cleaned, // Format biasa: 628123456789
      cleaned + '@c.us', // Format dengan @c.us: 628123456789@c.us
      cleaned.startsWith('0') ? cleaned : '0' + cleaned.replace(/^62/, ''), // Format dengan 0: 08123456789
      cleaned.startsWith('62') ? cleaned : '62' + (cleaned.startsWith('0') ? cleaned.substring(1) : cleaned), // Format dengan 62: 628123456789
    ];
    
    // Default format
    return cleaned.startsWith('62') ? cleaned + '@c.us' : '62' + (cleaned.startsWith('0') ? cleaned.substring(1) : cleaned) + '@c.us';
  } catch (error) {
    console.error('Error detecting phone number format:', error);
    return null;
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
    // Pastikan format nomor telepon benar
    let formattedNumber = to;
    
    // Bersihkan nomor dari karakter non-digit
    formattedNumber = formattedNumber.replace(/\D/g, '');
    
    // Jika dimulai dengan 0, ganti dengan 62
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.substring(1);
    }
    
    // Jika belum dimulai dengan 62, tambahkan
    if (!formattedNumber.startsWith('62')) {
      formattedNumber = '62' + formattedNumber;
    }
    
    // Coba beberapa format nomor telepon yang berbeda
    let formats = [
      formattedNumber + '@c.us', // Format dengan @c.us: 628123456789@c.us
      formattedNumber, // Format biasa: 628123456789
    ];
    
    // Coba deteksi format yang valid
    const detectedFormat = await detectPhoneNumberFormat(formattedNumber);
    if (detectedFormat) {
      formats.unshift(detectedFormat); // Tambahkan format terdeteksi di awal array
    }
    
    console.log(`Mencoba mengirim pesan ke nomor dengan format: ${formats.join(', ')}`);
    
    let lastError = null;
    
    // Coba setiap format secara berurutan
    for (const format of formats) {
      try {
        console.log(`Mencoba format: ${format}`);
        
        const response = await axiosInstance.post('/whatsapp/send', {
          to: format,
          message,
        });
        
        if (response.status === 200 || response.status === 201) {
          console.log(`Pesan berhasil dikirim dengan format ${format}:`, response.data);
          return response.data;
        } else {
          console.warn(`Respons tidak berhasil untuk format ${format}:`, response.status, response.data);
        }
      } catch (formatError) {
        console.warn(`Error untuk format ${format}:`, formatError);
        lastError = formatError;
      }
    }
    
    // Jika semua format gagal, lempar error terakhir
    if (lastError) {
      throw lastError;
    }
    
    throw new Error(`Gagal mengirim pesan ke semua format nomor: ${formats.join(', ')}`);
  } catch (error: unknown) {
    console.error('Error sending WhatsApp message:', error);
    
    // Ekstrak informasi error yang lebih detail
    let errorMessage = 'Gagal mengirim pesan WhatsApp';
    
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      
      console.error('Detail error respons:', {
        status: error.response.status,
        data: responseData
      });
      
      if (responseData && typeof responseData === 'object' && 'message' in responseData) {
        errorMessage = `Server: ${String(responseData.message)}`;
      } else if (responseData && typeof responseData === 'string') {
        errorMessage = `Server: ${responseData}`;
      } else {
        errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const sendWhatsAppMessageToAdmin = async (message: string) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Pesan tidak valid');
  }

  try {
    console.log(`Mengirim pesan ke admin: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
    
    const response = await axiosInstance.post('/whatsapp/send-admin', { message });
    
    if (response.status === 200 || response.status === 201) {
      console.log('Pesan berhasil dikirim ke admin:', response.data);
      return response.data;
    } else {
      console.warn('Respons tidak berhasil:', response.status, response.data);
      throw new Error(`Gagal mengirim pesan ke admin: ${response.status} ${response.statusText}`);
    }
  } catch (error: unknown) {
    console.error('Error sending WhatsApp message to admin:', error);
    
    // Ekstrak informasi error yang lebih detail
    let errorMessage = 'Gagal mengirim pesan WhatsApp ke admin';
    
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      
      console.error('Detail error respons:', {
        status: error.response.status,
        data: responseData
      });
      
      if (responseData && typeof responseData === 'object' && 'message' in responseData) {
        errorMessage = `Server: ${String(responseData.message)}`;
      } else if (responseData && typeof responseData === 'string') {
        errorMessage = `Server: ${responseData}`;
      } else {
        errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const getAllWhatsAppSessions = async () => {
  try {
    const response = await axiosInstance.get('/whatsapp/status');
    return response.data;
  } catch (error: unknown) {
    console.error('Error getting WhatsApp sessions:', error);
    throw error;
  }
};

export const getWhatsAppChats = async () => {
  try {
    const response = await axiosInstance.get('/whatsapp/chats');
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
    const response = await axiosInstance.get(`/whatsapp/messages/${phone}`);
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
    const response = await axiosInstance.get(`/whatsapp/contact/${phone}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error getting WhatsApp contact:', error);
    throw error;
  }
};

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

        // Menangani format respons dari server wppconnect
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
    // Coba reset-session terlebih dahulu (GET)
    try {
      const response = await axios.get('/whatsapp/reset-session');
      console.log('Reset session berhasil:', response.data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Reset session gagal, mencoba metode lain...', errorMessage);
      
      // Jika gagal, coba start-all (POST)
      try {
        const response = await axios.post('/whatsapp/start-all', {});
        console.log('Start all sessions berhasil:', response.data);
        return response.data;
      } catch {
        const response = await axios.post('/whatsapp/connect', {});
        console.log('Connect berhasil:', response.data);
        return response.data;
      }
    }
  } catch (error: unknown) {
    console.error('Error resetting WhatsApp connection:', error);
    throw error;
  }
};

export const logoutWhatsAppSession = async () => {
  try {
    // Mencoba endpoint logout-session terlebih dahulu
    try {
      const response = await axios.post('/whatsapp/logout-session', {});
      console.log('Logout session berhasil:', response.data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Logout dengan endpoint logout-session gagal:', errorMessage);
      
      // Jika gagal, coba reset-session sebagai alternatif
      try {
        const response = await axios.get('/whatsapp/reset-session');
        console.log('Reset session berhasil sebagai alternatif logout:', response.data);
        return response.data;
      } catch {
        // Jika masih gagal, coba closeSession dengan endpoint lain
        const response = await axios.post('/whatsapp/close-session', {});
        console.log('Close session berhasil:', response.data);
        return response.data;
      }
    }
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
    
    // Cek format mana yang valid dengan melakukan request ke API
    for (const format of formats) {
      try {
        const response = await axios.get(`/whatsapp/contact/${format}`);
        if (response.status === 200 && response.data) {
          console.log(`Format nomor telepon valid terdeteksi: ${format}`);
          return format;
        }
      } catch (error) {
        console.warn(`Format ${format} tidak valid:`, error);
      }
    }
    
    // Jika tidak ada format yang valid, gunakan default
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
      formattedNumber.replace(/^62/, '0'), // Format dengan 0: 08123456789
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
        
        const response = await axios.post('/whatsapp/send-message', {
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
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Cek apakah ini error dari axios dengan respons
      if ('response' in error && error.response) {
        const axiosError = error as {
          response: {
            status: number;
            statusText: string;
            data: Record<string, unknown> | string | null;
          };
        };
        const responseData = axiosError.response.data;
        
        console.error('Detail error respons:', {
          status: axiosError.response.status,
          data: responseData
        });
        
        if (responseData && typeof responseData === 'object' && 'message' in responseData) {
          errorMessage = `Server: ${String(responseData.message)}`;
        } else if (responseData && typeof responseData === 'string') {
          errorMessage = `Server: ${responseData}`;
        } else {
          errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
        }
      }
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
    
    const response = await axios.post('/whatsapp/send-to-admin', { message });
    
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
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Cek apakah ini error dari axios dengan respons
      if ('response' in error && error.response) {
        const axiosError = error as {
          response: {
            status: number;
            statusText: string;
            data: Record<string, unknown> | string | null;
          };
        };
        const responseData = axiosError.response.data;
        
        console.error('Detail error respons:', {
          status: axiosError.response.status,
          data: responseData
        });
        
        if (responseData && typeof responseData === 'object' && 'message' in responseData) {
          errorMessage = `Server: ${String(responseData.message)}`;
        } else if (responseData && typeof responseData === 'string') {
          errorMessage = `Server: ${responseData}`;
        } else {
          errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
        }
      }
    }
    
    throw new Error(errorMessage);
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

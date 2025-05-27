import { API_URL } from "../config";
import Cookies from "js-cookie";

// Helper functions
const getToken = (): string | undefined => {
  return Cookies.get("accessToken") || localStorage.getItem("accessToken") || undefined;
};

export const apiGet = async (endpoint: string, params?: any) => {
  const url = new URL(`${API_URL}${endpoint}`);
  
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
  }
  
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat mengambil data");
  }
  
  return await response.json();
};

export const apiPost = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat mengirim data");
  }
  
  return await response.json();
};

export const apiDelete = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat menghapus data");
  }
  
  return await response.json();
};

export const apiPatch = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat memperbarui data");
  }
  
  return await response.json();
};

export const apiPostFormData = async (endpoint: string, formData: FormData) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat mengirim data");
  }
  
  return await response.json();
};

export const apiPatchFormData = async (endpoint: string, formData: FormData) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan saat memperbarui data");
  }
  
  return await response.json();
};

// Blog API
export const getBlogPosts = async (params?: any) => {
  return await apiGet("/blog", params);
};

export const getBlogPost = async (id: string) => {
  return await apiGet(`/blog/${id}`);
};

export const getBlogPostBySlug = async (slug: string) => {
  return await apiGet(`/blog/by-slug/${slug}`);
};

export const createBlogPost = async (formData: FormData) => {
  return await apiPostFormData("/blog", formData);
};

export const updateBlogPost = async (id: string, formData: FormData) => {
  return await apiPatchFormData(`/blog/${id}`, formData);
};

export const deleteBlogPost = async (id: string) => {
  return await apiDelete(`/blog/${id}`);
};

// WhatsApp API
export const getWhatsAppStatus = async () => {
  try {
    const response = await apiGet("/whatsapp/status");
    // Normalisasi format respons
    return {
      connected: response.connected || 
                 response.status === 'success' || 
                 response.data?.connected || 
                 response.data?.status === 'CONNECTED',
      state: response.state || response.data?.state || 'UNKNOWN',
      message: response.message || response.data?.message || '',
    };
  } catch (error) {
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
    return await apiGet("/whatsapp/session-status");
  } catch (error) {
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
    const response = await apiGet("/whatsapp/qr-code");
    return response;
  } catch (error) {
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

export const resetWhatsAppConnection = async () => {
  try {
    return await apiPost("/whatsapp/reset", {});
  } catch (error) {
    console.error("Error resetting WhatsApp connection:", error);
    throw error;
  }
};

export const logoutWhatsAppSession = async () => {
  try {
    return await apiPost("/whatsapp/logout", {});
  } catch (error) {
    console.error("Error logging out WhatsApp session:", error);
    throw error;
  }
};

export const startAllWhatsAppSessions = async () => {
  try {
    return await apiPost("/whatsapp/start-all", {});
  } catch (error) {
    console.error("Error starting WhatsApp sessions:", error);
    // Jika terjadi error "Invalid response format", tambahkan pesan yang lebih jelas
    if (error instanceof Error && error.message.includes('Invalid response format')) {
      throw new Error("Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah pada layanan WhatsApp backend.");
    }
    throw error;
  }
};

export const getAllWhatsAppSessions = async () => {
  return await apiGet("/whatsapp/all-sessions");
};

export const getWhatsAppChats = async () => {
  return await apiGet("/whatsapp/chats");
};

export const getWhatsAppMessages = async (phone: string) => {
  return await apiGet(`/whatsapp/messages/${phone}`);
};

export const getWhatsAppContact = async (phone: string) => {
  return await apiGet(`/whatsapp/contact/${phone}`);
};

export const sendWhatsAppMessage = async (to: string, message: string) => {
  return await apiPost("/whatsapp/send", { to, message });
};

export const sendWhatsAppMessageToAdmin = async (message: string) => {
  return await apiPost("/whatsapp/send-admin", { message });
}; 
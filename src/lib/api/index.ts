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
  return await apiGet("/whatsapp/status");
};

export const getWhatsAppSessionStatus = async () => {
  return await apiGet("/whatsapp/session-status");
};

export const getWhatsAppQrCode = async () => {
  return await apiGet("/whatsapp/qr-code");
};

export const resetWhatsAppConnection = async () => {
  return await apiPost("/whatsapp/reset", {});
};

export const logoutWhatsAppSession = async () => {
  return await apiPost("/whatsapp/logout", {});
};

export const startAllWhatsAppSessions = async () => {
  return await apiPost("/whatsapp/start-all", {});
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
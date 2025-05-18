import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fungsi untuk mendapatkan token dari cookies atau localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Coba dapatkan dari cookies dulu (prioritas)
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return cookieToken;
  
  // Fallback: coba dari localStorage
  return localStorage.getItem('accessToken');
};

// Tipe data untuk login
export interface LoginCredentials {
  username: string;
  password: string;
}

// Tipe data untuk respons login
export interface LoginResponse {
  access_token: string;
  admin: {
    id: string;
    username: string;
    nama: string;
  };
}

// Tipe data untuk admin
export interface Admin {
  id: string;
  username: string;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

// Fungsi untuk login
export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('Username atau password salah');
  }
};

// Fungsi untuk mendapatkan daftar admin
export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/debug`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan daftar admin');
  }
};

// Fungsi untuk membuat admin baru
export const createAdmin = async (data: { username: string; password: string; nama: string }): Promise<Admin> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/admin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal membuat admin baru');
  }
};

// Fungsi untuk mengupdate admin
export const updateAdmin = async (id: string, data: { username?: string; password?: string; nama?: string }): Promise<Admin> => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/admin/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mengupdate admin');
  }
};

// Fungsi untuk menghapus admin
export const deleteAdmin = async (id: string): Promise<Admin> => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal menghapus admin');
  }
}; 
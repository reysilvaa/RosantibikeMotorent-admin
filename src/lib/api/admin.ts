import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';
import { Admin } from '../types/admin';

// Fungsi untuk mendapatkan daftar admin
export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus admin');
  }
};

// Fungsi untuk mendapatkan detail admin berdasarkan ID
export const getAdminById = async (id: string): Promise<Admin> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail admin');
  }
}; 
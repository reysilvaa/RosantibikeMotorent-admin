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

// Interface untuk jenis motor
export interface JenisMotor {
  id: string;
  merk: string;
  model: string;
  cc: number;
  gambar?: string;
  nama: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Fungsi untuk mendapatkan semua jenis motor
export const getJenisMotor = async (): Promise<JenisMotor[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/jenis-motor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan data jenis motor');
  }
};

// Fungsi untuk mendapatkan detail jenis motor berdasarkan ID
export const getJenisMotorDetail = async (id: string): Promise<JenisMotor> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/jenis-motor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan detail jenis motor');
  }
};

// Fungsi untuk mendapatkan detail jenis motor berdasarkan slug
export const getJenisMotorBySlug = async (slug: string): Promise<JenisMotor> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/jenis-motor/slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan detail jenis motor berdasarkan slug');
  }
};

// Fungsi untuk membuat jenis motor baru
export const createJenisMotor = async (data: FormData): Promise<JenisMotor> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/jenis-motor`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal membuat jenis motor baru');
  }
};

// Fungsi untuk mengupdate jenis motor
export const updateJenisMotor = async (id: string, data: FormData): Promise<JenisMotor> => {
  try {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/jenis-motor/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mengupdate jenis motor');
  }
};

// Fungsi untuk menghapus jenis motor
export const deleteJenisMotor = async (id: string): Promise<JenisMotor> => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/jenis-motor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal menghapus jenis motor');
  }
}; 
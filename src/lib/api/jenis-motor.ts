import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';
import { JenisMotor } from '../types/jenis-motor';

// Fungsi untuk mendapatkan semua jenis motor
export const getJenisMotor = async (): Promise<JenisMotor[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/jenis-motor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
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
    return response.data.data || response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus jenis motor');
  }
}; 
import axios from '../axios';
import { Admin } from '../types/admin';

export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await axios.get(`/admin`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan daftar admin');
  }
};

export const createAdmin = async (data: {
  username: string;
  password: string;
  nama: string;
}): Promise<Admin> => {
  try {
    const response = await axios.post(`/admin`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membuat admin baru');
  }
};

export const updateAdmin = async (
  id: string,
  data: { username?: string; password?: string; nama?: string }
): Promise<Admin> => {
  try {
    const response = await axios.put(`/admin/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate admin');
  }
};

export const deleteAdmin = async (id: string): Promise<Admin> => {
  try {
    const response = await axios.delete(`/admin/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus admin');
  }
};

export const getAdminById = async (id: string): Promise<Admin> => {
  try {
    const response = await axios.get(`/admin/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail admin');
  }
};

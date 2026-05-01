import axios from 'axios';
import axiosInstance from '../axios';
import { Admin } from '../types/admin';

export const getAdmins = async (params?: { search?: string }): Promise<Admin[]> => {
  try {
    const response = await axiosInstance.get(`/admin`, { params });
    return response.data.data || response.data;
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
    const response = await axiosInstance.post(`/admin`, data);
    return response.data.data;
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
    const response = await axiosInstance.put(`/admin/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate admin');
  }
};

export const deleteAdmin = async (id: string): Promise<Admin> => {
  try {
    const response = await axiosInstance.delete(`/admin/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus admin');
  }
};

export const getAdminById = async (id: string): Promise<Admin> => {
  try {
    const response = await axiosInstance.get(`/admin/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail admin');
  }
};

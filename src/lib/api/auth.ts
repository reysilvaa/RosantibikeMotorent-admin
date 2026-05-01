import axiosInstance from '../axios';
import axios from 'axios';
import { LoginCredentials, LoginResponse } from '../types/admin';
import { removeAdminData } from '../cookies';

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          throw new Error('Username atau password salah');
        }

        if (data && typeof data === 'object' && 'message' in data) {
          throw new Error(data.message as string);
        }
      } else if (error.request) {
        throw new Error(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          {
            cause: error,
          }
        );
      }
    }

    throw new Error('Terjadi kesalahan saat login. Silakan coba lagi.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(`/auth/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      removeAdminData();

      window.location.replace('/auth/login');
    }
  }
};

export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

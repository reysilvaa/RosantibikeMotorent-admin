import axios from '../axios';
import { LoginCredentials, LoginResponse } from '../types/admin';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`/auth/login`, credentials, {
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
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
    }
    
    throw new Error('Terjadi kesalahan saat login. Silakan coba lagi.');
  }
}; 

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`/auth/logout`, {});
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Gagal logout');
  }
}; 
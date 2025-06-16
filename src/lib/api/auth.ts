import axios from 'axios';
import { API_URL } from '../config';
import { LoginCredentials, LoginResponse } from '../types/admin';

// Fungsi untuk login
export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Username atau password salah');
  }
}; 
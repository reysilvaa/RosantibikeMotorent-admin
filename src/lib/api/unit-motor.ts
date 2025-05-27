import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';
import { PaginationResponse } from '../types/common';
import { FilterUnitMotor, UnitMotor } from '../types/unit-motor';

// Fungsi untuk mendapatkan semua unit motor
export const getUnitMotor = async (filter: FilterUnitMotor = {}): Promise<PaginationResponse<UnitMotor>> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/unit-motor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan data unit motor');
  }
};

// Fungsi untuk mendapatkan detail unit motor
export const getUnitMotorDetail = async (id: string): Promise<UnitMotor> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/unit-motor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan detail unit motor');
  }
};

// Fungsi untuk membuat unit motor baru
export const createUnitMotor = async (data: {
  plat: string;
  tahunPembuatan: string;
  hargaSewa: number;
  jenisMotorId: string;
}): Promise<UnitMotor> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/unit-motor`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal membuat unit motor baru');
  }
};

// Fungsi untuk mengupdate unit motor
export const updateUnitMotor = async (
  id: string,
  data: {
    plat?: string;
    tahunPembuatan?: string;
    hargaSewa?: number;
    status?: string;
    jenisMotorId?: string;
  }
): Promise<UnitMotor> => {
  try {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/unit-motor/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mengupdate unit motor');
  }
};

// Fungsi untuk menghapus unit motor
export const deleteUnitMotor = async (id: string): Promise<UnitMotor> => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/unit-motor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal menghapus unit motor');
  }
}; 
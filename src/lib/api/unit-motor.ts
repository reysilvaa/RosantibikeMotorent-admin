import axios from '../axios';
import { PaginationResponse } from '../types/common';
import { FilterUnitMotor, UnitMotor } from '../types/unit-motor';

export const getUnitMotor = async (filter: FilterUnitMotor = {}): Promise<PaginationResponse<UnitMotor>> => {
  try {
    const response = await axios.get(`/unit-motor`, {
      params: filter,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data unit motor');
  }
};

export const getUnitMotorDetail = async (id: string): Promise<UnitMotor> => {
  try {
    const response = await axios.get(`/unit-motor/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail unit motor');
  }
};

export const createUnitMotor = async (data: {
  plat: string;
  tahunPembuatan: string;
  hargaSewa: number;
  jenisMotorId: string;
}): Promise<UnitMotor> => {
  try {
    const response = await axios.post(`/unit-motor`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membuat unit motor baru');
  }
};

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
    const response = await axios.patch(`/unit-motor/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate unit motor');
  }
};

export const deleteUnitMotor = async (id: string): Promise<UnitMotor> => {
  try {
    const response = await axios.delete(`/unit-motor/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus unit motor');
  }
}; 
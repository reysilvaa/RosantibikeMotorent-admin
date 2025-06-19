import axios from '../axios';
import { PaginationResponse } from '../types/common';
import { FilterTransaksi, Transaksi } from '../types/transaksi';

export const getTransaksi = async (filter: FilterTransaksi = {}): Promise<PaginationResponse<Transaksi>> => {
  try {
    const response = await axios.get(`/transaksi`, {
      params: filter,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error response:', axios.isAxiosError(error) ? error.response?.data : error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data transaksi');
  }
};

export const getTransaksiDetail = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axios.get(`/transaksi/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail transaksi');
  }
};

export const selesaikanTransaksi = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axios.post(`/transaksi/${id}/selesai`, {});
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menyelesaikan transaksi');
  }
};

export const getLaporanDenda = async (startDate: string, endDate: string): Promise<Record<string, unknown>> => {
  try {
    const response = await axios.get(`/transaksi/laporan/denda`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan laporan denda');
  }
};

export const getLaporanFasilitas = async (startDate: string, endDate: string): Promise<Record<string, unknown>> => {
  try {
    const response = await axios.get(`/transaksi/laporan/fasilitas`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan laporan fasilitas');
  }
};

export const createTransaksi = async (data: Partial<Transaksi>): Promise<Transaksi> => {
  try {
    const response = await axios.post(`/transaksi`, data);
    return response.data.data;
  } catch (error: unknown) {
    console.error('Error response:', axios.isAxiosError(error) ? error.response?.data : error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(`Gagal membuat transaksi: ${error.response.data.message}`);
    }
    throw new Error('Gagal membuat transaksi baru');
  }
}; 
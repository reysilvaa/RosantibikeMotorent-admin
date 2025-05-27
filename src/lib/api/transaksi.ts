import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';
import { PaginationResponse } from '../types/common';
import { FilterTransaksi, Transaksi } from '../types/transaksi';

// Fungsi untuk mendapatkan semua transaksi
export const getTransaksi = async (filter: FilterTransaksi = {}): Promise<PaginationResponse<Transaksi>> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/transaksi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan data transaksi');
  }
};

// Fungsi untuk mendapatkan detail transaksi
export const getTransaksiDetail = async (id: string): Promise<Transaksi> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/transaksi/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan detail transaksi');
  }
};

// Fungsi untuk mengupdate status transaksi menjadi selesai
export const selesaikanTransaksi = async (id: string): Promise<Transaksi> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/transaksi/${id}/selesai`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal menyelesaikan transaksi');
  }
};

// Fungsi untuk mendapatkan laporan denda
export const getLaporanDenda = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/transaksi/laporan/denda`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan laporan denda');
  }
};

// Fungsi untuk mendapatkan laporan fasilitas
export const getLaporanFasilitas = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/transaksi/laporan/fasilitas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mendapatkan laporan fasilitas');
  }
}; 
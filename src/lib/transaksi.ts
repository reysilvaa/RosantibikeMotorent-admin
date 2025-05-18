import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fungsi untuk mendapatkan token dari cookies atau localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Coba dapatkan dari cookies dulu (prioritas)
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return cookieToken;
  
  // Fallback: coba dari localStorage
  return localStorage.getItem('accessToken');
};

// Enum untuk status transaksi
export enum StatusTransaksi {
  BOOKING = 'BOOKING',
  BERJALAN = 'BERJALAN',
  SELESAI = 'SELESAI',
  BATAL = 'BATAL',
  OVERDUE = 'OVERDUE',
}

// Interface untuk response pagination
export interface PaginationResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Interface untuk transaksi
export interface Transaksi {
  id: string;
  namaPenyewa: string;
  noHP: string;
  alamat: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalHarga: number;
  status: StatusTransaksi;
  createdAt: string;
  updatedAt: string;
  unitMotorId: string;
  unitMotor?: {
    id: string;
    plat: string;
    tahunPembuatan: string;
    hargaSewa: number;
    status: string;
    jenisMotorId: string;
    jenisMotor?: {
      id: string;
      nama: string;
      gambar: string;
    };
  };
  fasilitas?: {
    id: string;
    nama: string;
    harga: number;
  }[];
}

// Interface untuk filter transaksi
export interface FilterTransaksi {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusTransaksi[] | StatusTransaksi;
  startDate?: string;
  endDate?: string;
}

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
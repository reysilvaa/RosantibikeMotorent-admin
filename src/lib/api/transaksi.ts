import axios from 'axios';
import axiosInstance from '../axios';
import { FilterTransaksi, Transaksi } from '../types/transaksi';

export const getTransaksi = async (
  filter: FilterTransaksi = {}
): Promise<Transaksi[]> => {
  try {
    const response = await axiosInstance.get(`/transaksi`, {
      params: filter,
    });
    return response.data.data || response.data || [];
  } catch (error: unknown) {
    console.error(
      'Error response:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data transaksi');
  }
};

export const getTransaksiDetail = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.get(`/transaksi/${id}`);
    
    // The API is returning the data directly in the response.data object, not in response.data.data
    // Check if response.data has the expected transaction properties
    if (response.data && response.data.id && response.data.namaPenyewa) {
      return response.data;
    } else if (response.data && response.data.data) {
      // Fallback to response.data.data if that's where the transaction data is
      return response.data.data;
    } else {
      throw new Error('Format respons API tidak sesuai');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail transaksi');
  }
};

export const selesaikanTransaksi = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.post(`/transaksi/${id}/selesai`, {});
    // Handle the same response structure as getTransaksiDetail
    if (response.data && response.data.id) {
      return response.data;
    } else if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Format respons API tidak sesuai');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menyelesaikan transaksi');
  }
};

export const getLaporanDenda = async (
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>> => {
  try {
    const response = await axiosInstance.get(`/transaksi/laporan/denda`, {
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

export const getLaporanFasilitas = async (
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>> => {
  try {
    const response = await axiosInstance.get(`/transaksi/laporan/fasilitas`, {
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

export const createTransaksi = async (
  data: Partial<Transaksi>
): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.post(`/transaksi`, data);
    // Handle the same response structure as getTransaksiDetail
    if (response.data && response.data.id) {
      return response.data;
    } else if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Format respons API tidak sesuai');
    }
  } catch (error: unknown) {
    console.error(
      'Error response:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(
        `Gagal membuat transaksi: ${error.response.data.message}`
      );
    }
    throw new Error('Gagal membuat transaksi baru');
  }
};

export const updateTransaksi = async (
  id: string,
  data: Partial<Transaksi>
): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.put(`/transaksi/${id}`, data);
    // Handle the same response structure as getTransaksiDetail
    if (response.data && response.data.id) {
      return response.data;
    } else if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Format respons API tidak sesuai');
    }
  } catch (error: unknown) {
    console.error(
      'Error response:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(
        `Gagal mengupdate transaksi: ${error.response.data.message}`
      );
    }
    throw new Error('Gagal mengupdate transaksi');
  }
};

export const confirmPayment = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.post(`/transaksi/${id}/confirm-payment`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengkonfirmasi pembayaran');
  }
};

export const failTransaction = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.post(`/transaksi/${id}/fail`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membatalkan transaksi');
  }
};

export const activateTransaction = async (id: string): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.post(`/transaksi/${id}/activate`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengaktifkan transaksi');
  }
};

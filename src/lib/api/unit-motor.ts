import axios from 'axios';
import axiosInstance from '../axios';
import { FilterUnitMotor, UnitMotor } from '../types/unit-motor';

export const getUnitMotor = async (
  filter: FilterUnitMotor = {}
): Promise<UnitMotor[]> => {
  try {
    // Convert admin filter format to backend format
    const backendFilter: any = { ...filter };

    // Convert status to isAvailable
    if (filter.status) {
      if (filter.status === 'TERSEDIA') {
        backendFilter.isAvailable = true;
      } else if (filter.status === 'DISEWA' || filter.status === 'TIDAK_TERSEDIA') {
        backendFilter.isAvailable = false;
      }
      delete backendFilter.status; // Remove status from backend params
    }

    const response = await axiosInstance.get(`/unit-motor`, {
      params: backendFilter,
    });

    console.log('Backend response:', response.data);

    // Extract data from nested structure: response.data.data.data
    let data = [];
    if (response.data?.data?.data) {
      data = response.data.data.data; // Service returns { data: [...], meta: {...} }, wrapped in successResponse
    } else if (response.data?.data) {
      data = Array.isArray(response.data.data) ? response.data.data : [];
    } else if (response.data) {
      data = Array.isArray(response.data) ? response.data : [];
    }

    console.log('Extracted data:', data);

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data);
      throw new Error('Invalid response format: expected array');
    }

    // Convert backend response format to admin format
    return data.map((unit: any) => {
      if (!unit || typeof unit !== 'object') {
        console.error('Invalid unit data:', unit);
        return unit;
      }

      return {
        ...unit,
        status: unit.isAvailable ? 'TERSEDIA' : 'DISEWA', // Convert isAvailable to status
      };
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data unit motor');
  }
};

export const getUnitMotorDetail = async (id: string): Promise<UnitMotor> => {
  try {
    const response = await axiosInstance.get(`/unit-motor/${id}`);

    console.log('Backend detail response:', response.data);

    // Extract data from successResponse structure
    const data = response.data?.data || response.data;

    console.log('Extracted detail data:', data);

    // Ensure data is a valid object
    if (!data || typeof data !== 'object') {
      console.error('Invalid detail data:', data);
      throw new Error('Invalid response format: expected object');
    }

    // Convert backend response format to admin format
    return {
      ...data,
      status: data.isAvailable ? 'TERSEDIA' : 'DISEWA', // Convert isAvailable to status
    };
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
    // Map admin field names to backend field names
    const backendData = {
      platNomor: data.plat,
      tahunPembuatan: parseInt(data.tahunPembuatan),
      hargaSewa: data.hargaSewa,
      jenisId: data.jenisMotorId,
    };

    const response = await axiosInstance.post(`/unit-motor`, backendData);

    console.log('Create response:', response.data);

    // Extract data from successResponse structure
    const responseData = response.data?.data || response.data;

    console.log('Extracted create data:', responseData);

    // Convert backend response format to admin format
    return {
      ...responseData,
      status: responseData.isAvailable ? 'TERSEDIA' : 'DISEWA',
    };
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
    // Map admin field names to backend field names
    const backendData: any = {};
    if (data.plat !== undefined) backendData.platNomor = data.plat;
    if (data.tahunPembuatan !== undefined) backendData.tahunPembuatan = parseInt(data.tahunPembuatan);
    if (data.hargaSewa !== undefined) backendData.hargaSewa = data.hargaSewa;
    if (data.jenisMotorId !== undefined) backendData.jenisId = data.jenisMotorId;

    // Convert status to isAvailable
    if (data.status !== undefined) {
      if (data.status === 'TERSEDIA') {
        backendData.isAvailable = true;
      } else if (data.status === 'DISEWA' || data.status === 'TIDAK_TERSEDIA') {
        backendData.isAvailable = false;
      }
    }

    const response = await axiosInstance.patch(`/unit-motor/${id}`, backendData);

    console.log('Update response:', response.data);

    // Extract data from successResponse structure
    const responseData = response.data?.data || response.data;

    console.log('Extracted update data:', responseData);

    // Convert backend response format to admin format
    return {
      ...responseData,
      status: responseData.isAvailable ? 'TERSEDIA' : 'DISEWA',
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate unit motor');
  }
};

export const deleteUnitMotor = async (id: string): Promise<UnitMotor> => {
  try {
    const response = await axiosInstance.delete(`/unit-motor/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus unit motor');
  }
};

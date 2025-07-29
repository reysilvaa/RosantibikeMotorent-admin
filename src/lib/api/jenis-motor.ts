import axios from 'axios';
import axiosInstance from '../axios';
import { JenisMotor } from '../types/jenis-motor';

export interface FilterJenisMotor {
  search?: string;
  page?: number;
  limit?: number;
}

export const getJenisMotor = async (filter: FilterJenisMotor = {}): Promise<JenisMotor[]> => {
  try {
    const response = await axiosInstance.get(`/jenis-motor`, {
      params: filter
    });

    console.log('Jenis Motor backend response:', response.data);

    // Backend returns: { data: [...], meta: {...} } directly from service
    // The data array is at response.data.data
    let data = [];

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      data = response.data.data; // Extract the data array
      console.log('Successfully extracted data array with', data.length, 'items');
    } else if (response.data && Array.isArray(response.data)) {
      data = response.data; // Fallback: direct array
      console.log('Using direct array fallback with', data.length, 'items');
    } else {
      console.error('Unexpected response structure. Expected { data: [...], meta: {...} }, got:', response.data);
      console.error('response.data type:', typeof response.data);
      console.error('response.data.data type:', typeof response.data?.data);
    }

    console.log('Final extracted jenis motor data:', data);

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data);
      throw new Error('Invalid response format: expected array');
    }

    return data;
  } catch (error: unknown) {
    console.error('Error in getJenisMotor:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data jenis motor');
  }
};

export const getJenisMotorDetail = async (id: string): Promise<JenisMotor> => {
  try {
    const response = await axiosInstance.get(`/jenis-motor/${id}`);

    console.log('Jenis Motor detail response:', response.data);

    // Extract data from service response (no wrapper for detail)
    const data = response.data?.data || response.data;

    console.log('Extracted jenis motor detail:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error in getJenisMotorDetail:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail jenis motor');
  }
};

export const getJenisMotorBySlug = async (
  slug: string
): Promise<JenisMotor> => {
  try {
    const response = await axiosInstance.get(`/jenis-motor/by-slug/${slug}`);

    console.log('Jenis Motor by slug response:', response.data);

    // This endpoint uses successResponse() wrapper
    const data = response.data?.data || response.data;

    console.log('Extracted jenis motor by slug:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error in getJenisMotorBySlug:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail jenis motor berdasarkan slug');
  }
};

export const createJenisMotor = async (
  data: FormData | Record<string, unknown>
): Promise<JenisMotor> => {
  try {
    const jsonData: Record<string, unknown> = {};

    if (data instanceof FormData) {
      for (const [key, value] of data.entries()) {
        if (key === 'cc') {
          jsonData[key] = parseInt(value.toString(), 10);
        } else {
          jsonData[key] = value;
        }
      }

      if (data.has('file')) {
        const response = await axiosInstance.post(`/jenis-motor`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Create jenis motor (with file) response:', response.data);
        return response.data?.data || response.data;
      }

      const response = await axiosInstance.post(`/jenis-motor`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Create jenis motor (JSON) response:', response.data);
      return response.data?.data || response.data;
    } else {
      const dataObj = data as Record<string, unknown>;
      if (typeof dataObj.cc === 'string') {
        dataObj.cc = parseInt(dataObj.cc, 10);
      }

      const response = await axiosInstance.post(`/jenis-motor`, dataObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Create jenis motor (object) response:', response.data);
      return response.data?.data || response.data;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membuat jenis motor baru');
  }
};

export const updateJenisMotor = async (
  id: string,
  data: FormData
): Promise<JenisMotor> => {
  try {
    const response = await axiosInstance.patch(`/jenis-motor/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update jenis motor response:', response.data);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    console.error('Error in updateJenisMotor:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate jenis motor');
  }
};

export const deleteJenisMotor = async (id: string): Promise<JenisMotor> => {
  try {
    const response = await axiosInstance.delete(`/jenis-motor/${id}`);
    console.log('Delete jenis motor response:', response.data);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    console.error('Error in deleteJenisMotor:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus jenis motor');
  }
};

import axios from '../axios';
import { JenisMotor } from '../types/jenis-motor';

export const getJenisMotor = async (): Promise<JenisMotor[]> => {
  try {
    const response = await axios.get(`/jenis-motor`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan data jenis motor');
  }
};

export const getJenisMotorDetail = async (id: string): Promise<JenisMotor> => {
  try {
    const response = await axios.get(`/jenis-motor/${id}`);
    return response.data.data || response.data;
  } catch (error: unknown) {
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
    const response = await axios.get(`/jenis-motor/slug/${slug}`);
    return response.data.data;
  } catch (error: unknown) {
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
        const response = await axios.post(`/jenis-motor`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.data;
      }

      const response = await axios.post(`/jenis-motor`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } else {
      const dataObj = data as Record<string, unknown>;
      if (typeof dataObj.cc === 'string') {
        dataObj.cc = parseInt(dataObj.cc, 10);
      }

      const response = await axios.post(`/jenis-motor`, dataObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
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
    const response = await axios.patch(`/jenis-motor/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate jenis motor');
  }
};

export const deleteJenisMotor = async (id: string): Promise<JenisMotor> => {
  try {
    const response = await axios.delete(`/jenis-motor/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus jenis motor');
  }
};

import axios from 'axios';
import axiosInstance from '../axios';
import { UnitMotor } from '../types/unit-motor';

export interface CheckAvailabilityParams {
  startDate: string;
  endDate: string;
  jamMulai?: string;
  jamSelesai?: string;
  jenisId?: string;
}

export interface CheckAvailabilityResponse {
  success: boolean;
  message: string;
  data: UnitMotor[];
}

export const checkAvailability = async (params: CheckAvailabilityParams): Promise<CheckAvailabilityResponse> => {
  try {
    const response = await axiosInstance.get('/availability/check', { params });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal memeriksa ketersediaan unit motor');
  }
};

import { JenisMotor } from './jenis-motor';
import { UnitMotor } from './unit-motor';

export enum StatusTransaksi {
  BOOKING = 'BOOKING',
  BERJALAN = 'BERJALAN',
  AKTIF = 'AKTIF',
  SELESAI = 'SELESAI',
  BATAL = 'BATAL',
  OVERDUE = 'OVERDUE',
}

export interface Transaksi {
  id: string;
  namaPenyewa: string;
  noWhatsapp: string;
  alamat?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalBiaya: number;
  status: StatusTransaksi;
  createdAt: string;
  updatedAt: string;
  unitId: string;
  biayaDenda: string;
  helm: number;
  jamMulai: string;
  jamSelesai: string;
  jasHujan: number;
  unitMotor: UnitMotor;
  jenis?: JenisMotor;
}

export interface FilterTransaksi {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusTransaksi[] | StatusTransaksi;
  startDate?: string;
  endDate?: string;
}

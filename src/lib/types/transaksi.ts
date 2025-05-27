import { UnitMotor } from './unit-motor';
import { JenisMotor } from './jenis-motor';

// Enum untuk status transaksi
export enum StatusTransaksi {
  BOOKING = 'BOOKING',
  BERJALAN = 'BERJALAN',
  AKTIF = 'AKTIF',
  SELESAI = 'SELESAI',
  BATAL = 'BATAL',
  OVERDUE = 'OVERDUE',
}

// Interface untuk transaksi
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

// Interface untuk filter transaksi
export interface FilterTransaksi {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusTransaksi[] | StatusTransaksi;
  startDate?: string;
  endDate?: string;
} 
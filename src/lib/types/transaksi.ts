import { UnitMotor } from './unit-motor';
import { JenisMotor } from './jenis-motor';

// Enum untuk status transaksi
export enum StatusTransaksi {
  BOOKING = 'BOOKING',
  BERJALAN = 'BERJALAN',
  SELESAI = 'SELESAI',
  BATAL = 'BATAL',
  OVERDUE = 'OVERDUE',
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
  unitMotor?: UnitMotor;
  jenisMotor?: JenisMotor;
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
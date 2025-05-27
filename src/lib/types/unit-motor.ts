import { JenisMotor } from './jenis-motor';

// Interface untuk unit motor
export interface UnitMotor {
  id: string;
  platNomor: string;
  tahunPembuatan: number;
  hargaSewa: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  JenisMotor?: JenisMotor;
}

// Interface untuk filter unit motor
export interface FilterUnitMotor {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  JenisMotor?: JenisMotor;
} 
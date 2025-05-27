import { JenisMotor } from './jenis-motor';

// Interface untuk unit motor
export interface UnitMotor {
  id: string;
  plat: string;
  tahunPembuatan: string;
  hargaSewa: number;
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
import { JenisMotor } from './jenis-motor';

export interface UnitMotor {
  id: string;
  platNomor: string;
  tahunPembuatan: number;
  hargaSewa: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  jenis?: JenisMotor;
}

export interface FilterUnitMotor {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jenis?: JenisMotor;
}

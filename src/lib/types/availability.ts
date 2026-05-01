export interface CheckAvailabilityDto {
  startDate: string;
  endDate: string;
  jenisId?: string;
  unitId?: string;
}

export interface AvailabilityResponse {
  id: string;
  platNomor: string;
  jenis: {
    id: string;
    merk: string;
    model: string;
  };
  status: 'TERSEDIA' | 'TIDAK_TERSEDIA';
  bookedTransactions?: Array<{
    id: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
  }>;
}

export interface AvailabilityResponseData {
  success: boolean;
  data: AvailabilityResponse[];
}

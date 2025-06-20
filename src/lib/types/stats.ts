import { StatusTransaksi } from '../transaksi';
import { UnitMotor } from '../unit-motor';

export interface StatistikData {
  totalTransaksi: number;
  pendapatanBulanIni: number;
  motorTersedia: number;
  transaksiPending: number;
  dataTransaksi: Array<{
    id: string;
    namaPenyewa: string;
    noHP: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: StatusTransaksi;
    totalHarga: number;
    unitMotor?: UnitMotor;
  }>;
  dataTransaksiBulan: Array<{
    bulan: string;
    jumlah: number;
  }>;
  dataStatusMotor: Array<{
    status: string;
    jumlah: number;
  }>;
}

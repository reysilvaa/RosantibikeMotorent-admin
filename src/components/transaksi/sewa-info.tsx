import { Tag, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { StatusTransaksi } from "@/lib/transaksi";

interface SewaInfoProps {
  status: StatusTransaksi;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalBiaya: number;
  getStatusBadgeClass: (status: StatusTransaksi) => string;
  formatTanggal: (date: string) => string;
}

export function SewaInfo({
  status,
  tanggalMulai,
  tanggalSelesai,
  totalBiaya,
  getStatusBadgeClass,
  formatTanggal,
}: SewaInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Sewa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <Tag className="mr-2 h-4 w-4" />
            <span>Status</span>
          </div>
          <p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                status
              )}`}
            >
              {status}
            </span>
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Tanggal Mulai</span>
          </div>
          <p className="text-lg font-medium">
            {formatTanggal(tanggalMulai)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Tanggal Selesai</span>
          </div>
          <p className="text-lg font-medium">
            {formatTanggal(tanggalSelesai)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Total Harga</span>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatRupiah(totalBiaya)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
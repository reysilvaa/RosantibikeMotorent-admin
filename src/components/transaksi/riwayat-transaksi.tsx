import { CheckCircle, ClipboardCheck, Clock8 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTransaksi } from "@/lib/transaksi";

interface RiwayatTransaksiProps {
  status: StatusTransaksi;
  createdAt: string;
  updatedAt: string;
  formatTanggalWaktu: (date: string) => string;
}

export function RiwayatTransaksi({
  status,
  createdAt,
  updatedAt,
  formatTanggalWaktu,
}: RiwayatTransaksiProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">Transaksi Dibuat</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {formatTanggalWaktu(createdAt)}
              </p>
            </div>
          </div>

          {status === StatusTransaksi.SELESAI && (
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                <ClipboardCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Transaksi Selesai</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatTanggalWaktu(updatedAt)}
                </p>
              </div>
            </div>
          )}

          {status === StatusTransaksi.OVERDUE && (
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                <Clock8 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium">Transaksi Overdue</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatTanggalWaktu(updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { Transaksi } from "@/lib/transaksi";
import { StatusBadge } from "./status-badge";

interface TransaksiTableProps {
  transaksi: Transaksi[];
  handleDetailClick: (id: string) => void;
  searchQuery: string;
  statusFilter: string;
}

export function TransaksiTable({
  transaksi,
  handleDetailClick,
  searchQuery,
  statusFilter,
}: TransaksiTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left">
        <thead>
          <tr className="border-b text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <th className="px-4 py-3">
              <div className="flex items-center">
                Penyewa
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </th>
            <th className="px-4 py-3">Motor</th>
            <th className="px-4 py-3">Mulai</th>
            <th className="px-4 py-3">Selesai</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transaksi.length > 0 ? (
            transaksi.map((item: Transaksi) => {              
              return (
                <tr
                  key={item.id}
                  className="border-b text-sm dark:border-neutral-800"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.namaPenyewa}
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.noWhatsapp}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.unitMotor?.jenis?.merk || item.unitMotor?.jenis?.merk || "-"} {item.unitMotor?.jenis?.model || item.unitMotor?.jenis?.model || ""}
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.unitMotor?.platNomor || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTanggal(item.tanggalMulai)}
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.jamMulai}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTanggal(item.tanggalSelesai)}
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.jamSelesai}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatRupiah(item.totalBiaya)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDetailClick(item.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Detail</span>
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
              >
                {searchQuery || statusFilter
                  ? "Tidak ada transaksi yang sesuai dengan filter"
                  : "Belum ada data transaksi"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 
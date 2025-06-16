import { Button } from "@/components/ui/button";
import { StatusTransaksi } from "@/lib/transaksi";

interface TransaksiFiltersProps {
  statusFilter: StatusTransaksi | "";
  handleStatusFilterChange: (status: StatusTransaksi | "") => void;
}

export function TransaksiFilters({
  statusFilter,
  handleStatusFilterChange,
}: TransaksiFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button
        variant={statusFilter === "" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusFilterChange("")}
      >
        Semua
      </Button>
      <Button
        variant={
          statusFilter === StatusTransaksi.BOOKING ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleStatusFilterChange(StatusTransaksi.BOOKING)}
      >
        Booking
      </Button>
      <Button
        variant={
          statusFilter === StatusTransaksi.AKTIF
            ? "default"
            : "outline"
        }
        size="sm"
        onClick={() =>
          handleStatusFilterChange(StatusTransaksi.AKTIF)
        }
      >
        Aktif
      </Button>
      <Button
        variant={
          statusFilter === StatusTransaksi.SELESAI ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleStatusFilterChange(StatusTransaksi.SELESAI)}
      >
        Selesai
      </Button>
      <Button
        variant={
          statusFilter === StatusTransaksi.BATAL ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleStatusFilterChange(StatusTransaksi.BATAL)}
      >
        Batal
      </Button>
      <Button
        variant={
          statusFilter === StatusTransaksi.OVERDUE ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleStatusFilterChange(StatusTransaksi.OVERDUE)}
      >
        Overdue
      </Button>
    </div>
  );
} 
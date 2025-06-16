import { StatusTransaksi } from "@/lib/transaksi";

interface StatusBadgeProps {
  status: StatusTransaksi;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = () => {
    switch (status) {
      case StatusTransaksi.SELESAI:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case StatusTransaksi.BERJALAN:
      case StatusTransaksi.AKTIF:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case StatusTransaksi.BOOKING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case StatusTransaksi.BATAL:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case StatusTransaksi.OVERDUE:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
} 
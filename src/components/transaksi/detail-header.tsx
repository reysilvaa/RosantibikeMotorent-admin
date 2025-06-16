import { ArrowLeft, ClipboardCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusTransaksi } from "@/lib/transaksi";

interface DetailHeaderProps {
  id: string;
  status: StatusTransaksi;
  processing: boolean;
  handleBack: () => void;
  handleSelesaikan: () => void;
}

export function DetailHeader({
  id,
  status,
  processing,
  handleBack,
  handleSelesaikan,
}: DetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="mr-4"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Kembali</span>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Detail Transaksi
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            ID: {id}
          </p>
        </div>
      </div>
      {status === StatusTransaksi.BERJALAN && (
        <Button
          variant="default"
          onClick={handleSelesaikan}
          disabled={processing}
        >
          {processing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="mr-2 h-4 w-4" />
          )}
          Selesaikan Transaksi
        </Button>
      )}
    </div>
  );
} 
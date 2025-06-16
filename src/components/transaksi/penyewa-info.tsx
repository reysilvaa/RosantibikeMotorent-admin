import { User, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaksi } from "@/lib/types/transaksi";
interface PenyewaInfoProps {
  namaPenyewa: Transaksi['namaPenyewa'];
  noWhatsapp: Transaksi['noWhatsapp'];
  alamat?: Transaksi['alamat'];
}

export function PenyewaInfo({ namaPenyewa, noWhatsapp, alamat }: PenyewaInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Penyewa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <User className="mr-2 h-4 w-4" />
            <span>Nama Penyewa</span>
          </div>
          <p className="text-lg font-medium">{namaPenyewa}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <Phone className="mr-2 h-4 w-4" />
            <span>Nomor Telepon</span>
          </div>
          <p className="text-lg font-medium">{noWhatsapp}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Alamat</span>
          </div>
          <p className="text-lg font-medium">{alamat}</p>
        </div>
      </CardContent>
    </Card>
  );
} 
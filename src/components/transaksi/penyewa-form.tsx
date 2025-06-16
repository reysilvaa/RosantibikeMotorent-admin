import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTransaksiFormStore } from "@/lib/store/transaksi-form-store";

export function PenyewaForm() {
  const { formData, setFormValue } = useTransaksiFormStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Penyewa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="namaPenyewa">Nama Penyewa <span className="text-red-500">*</span></Label>
          <Input
            id="namaPenyewa"
            name="namaPenyewa"
            placeholder="Masukkan nama penyewa"
            value={formData?.namaPenyewa || ""}
            onChange={(e) => setFormValue("namaPenyewa", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noWhatsapp">Nomor WhatsApp <span className="text-red-500">*</span></Label>
          <Input
            id="noWhatsapp"
            name="noWhatsapp"
            placeholder="Contoh: 628123456789"
            value={formData?.noWhatsapp || ""}
            onChange={(e) => setFormValue("noWhatsapp", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            name="alamat"
            placeholder="Masukkan alamat penyewa (opsional)"
            value={formData?.alamat || ""}
            onChange={(e) => setFormValue("alamat", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
} 
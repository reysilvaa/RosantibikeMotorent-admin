import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { useTransaksiFormStore } from "@/lib/store/transaksi-form-store";
import { getUnitMotor } from "@/lib/api/unit-motor";
import { UnitMotor } from "@/lib/types/unit-motor";
import { toast } from "sonner";

export function SewaForm() {
  const { formData, setFormValue } = useTransaksiFormStore();
  const [unitMotorList, setUnitMotorList] = useState<UnitMotor[]>([]);
  const [loadingUnitMotor, setLoadingUnitMotor] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<UnitMotor | null>(null);

  useEffect(() => {
    fetchUnitMotor();
  }, []);

  const fetchUnitMotor = async () => {
    try {
      setLoadingUnitMotor(true);
      const response = await getUnitMotor({ status: "TERSEDIA" });
      setUnitMotorList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data unit motor:", error);
      toast.error("Gagal mengambil data unit motor");
    } finally {
      setLoadingUnitMotor(false);
    }
  };

  const handleUnitChange = (value: string) => {
    setFormValue("unitId", value);
    const selected = unitMotorList.find((unit) => unit.id === value);
    setSelectedUnit(selected || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Sewa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unitId">Unit Motor <span className="text-red-500">*</span></Label>
          <Select
            value={formData?.unitId || ""}
            onValueChange={handleUnitChange}
            disabled={loadingUnitMotor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih unit motor" />
            </SelectTrigger>
            <SelectContent>
              {loadingUnitMotor ? (
                <SelectItem value="loading" disabled>
                  Memuat data...
                </SelectItem>
              ) : unitMotorList.length > 0 ? (
                unitMotorList.map((unit: UnitMotor) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.jenis?.merk} {unit.jenis?.model} - {unit.platNomor}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  Tidak ada unit motor tersedia
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedUnit && (
            <div className="mt-2 rounded-md bg-neutral-100 p-3 text-sm dark:bg-neutral-800">
              <p className="font-medium">Harga Sewa: {formatRupiah(selectedUnit.hargaSewa)}/hari</p>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tanggal Mulai <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {formData?.tanggalMulai ? (
                    format(new Date(formData.tanggalMulai), "dd MMMM yyyy", {
                      locale: id,
                    })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData?.tanggalMulai ? new Date(formData.tanggalMulai) : undefined}
                  onSelect={(date) => date && setFormValue("tanggalMulai", format(date, "yyyy-MM-dd"))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jamMulai">Jam Mulai <span className="text-red-500">*</span></Label>
            <Input
              type="time"
              id="jamMulai"
              name="jamMulai"
              value={formData?.jamMulai || ""}
              onChange={(e) => setFormValue("jamMulai", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tanggal Selesai <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {formData?.tanggalSelesai ? (
                    format(new Date(formData.tanggalSelesai), "dd MMMM yyyy", {
                      locale: id,
                    })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData?.tanggalSelesai ? new Date(formData.tanggalSelesai) : undefined}
                  onSelect={(date) => date && setFormValue("tanggalSelesai", format(date, "yyyy-MM-dd"))}
                  disabled={(date) => formData?.tanggalMulai ? date < new Date(formData.tanggalMulai) : false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jamSelesai">Jam Selesai <span className="text-red-500">*</span></Label>
            <Input
              type="time"
              id="jamSelesai"
              name="jamSelesai"
              value={formData?.jamSelesai || ""}
              onChange={(e) => setFormValue("jamSelesai", e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
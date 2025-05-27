"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ShoppingCart, Save, ArrowLeft } from "lucide-react";
import { createTransaksi } from "@/lib/transaksi";
import { getUnitMotor } from "@/lib/api/unit-motor";
import { UnitMotor } from "@/lib/types/unit-motor";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import { Transaksi } from "@/lib/types/transaksi";
export default function TambahTransaksiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unitMotorList, setUnitMotorList] = useState<UnitMotor[]>([]);
  const [loadingUnitMotor, setLoadingUnitMotor] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<UnitMotor | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    namaPenyewa: "",
    noWhatsapp: "",
    alamat: "",
    unitId: "",
    tanggalMulai: format(new Date(), "yyyy-MM-dd"),
    tanggalSelesai: format(new Date(), "yyyy-MM-dd"),
    jamMulai: "08:00",
    jamSelesai: "08:00",
    helm: 0,
    jasHujan: 0,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "unitId") {
      const selected = unitMotorList.find((unit) => unit.id === value);
      setSelectedUnit(selected || null);
    }
  };

  const handleDateChange = (date: Date | undefined, field: string) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.namaPenyewa || !formData.noWhatsapp || !formData.unitId) {
      toast.error("Mohon lengkapi data wajib");
      return;
    }

    try {
      setIsLoading(true);
      
      await createTransaksi({ transaksi: formData as Transaksi });
      toast.success("Transaksi berhasil dibuat");
      router.push("/dashboard/transaksi");
    } catch (error: any) {
      console.error("Gagal membuat transaksi:", error);
      toast.error(error.message || "Gagal membuat transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tambah Transaksi</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Tambahkan transaksi rental motor baru
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/transaksi")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informasi Penyewa */}
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
                    value={formData.namaPenyewa}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noWhatsapp">Nomor WhatsApp <span className="text-red-500">*</span></Label>
                  <Input
                    id="noWhatsapp"
                    name="noWhatsapp"
                    placeholder="Contoh: 628123456789"
                    value={formData.noWhatsapp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    placeholder="Masukkan alamat penyewa (opsional)"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informasi Sewa */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Sewa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unitId">Unit Motor <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) => handleSelectChange("unitId", value)}
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
                        unitMotorList.map((unit) => (
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
                          {formData.tanggalMulai ? (
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
                          selected={new Date(formData.tanggalMulai)}
                          onSelect={(date) => handleDateChange(date, "tanggalMulai")}
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
                      value={formData.jamMulai}
                      onChange={handleChange}
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
                          {formData.tanggalSelesai ? (
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
                          selected={new Date(formData.tanggalSelesai)}
                          onSelect={(date) => handleDateChange(date, "tanggalSelesai")}
                          disabled={(date) => date < new Date(formData.tanggalMulai)}
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
                      value={formData.jamSelesai}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fasilitas Tambahan */}
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="helm">Jumlah Helm</Label>
                    <Input
                      type="number"
                      id="helm"
                      name="helm"
                      min={0}
                      value={formData.helm}
                      onChange={handleNumberChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jasHujan">Jumlah Jas Hujan</Label>
                    <Input
                      type="number"
                      id="jasHujan"
                      name="jasHujan"
                      min={0}
                      value={formData.jasHujan}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tombol Submit */}
            <div className="col-span-2 mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/transaksi")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Transaksi
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

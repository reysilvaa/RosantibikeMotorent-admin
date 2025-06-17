"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/ui/form-actions";
import { StatusMessage } from "@/components/ui/status-message";
import { formatRupiah } from "@/lib/utils";
import { useTransaksiFormStore } from "@/lib/store/transaksi/transaksi-form-store";
import { getUnitMotor } from "@/lib/api/unit-motor";
import { UnitMotor } from "@/lib/types/unit-motor";
import { toast } from "sonner";

interface TransaksiFormProps {
  onCancel: () => void;
}

export function TransaksiForm({ onCancel }: TransaksiFormProps) {
  const { formData, setFormData, resetForm, submitForm } = useTransaksiFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  // State untuk unit motor
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
    setFormData({ unitId: value });
    const selected = unitMotorList.find((unit) => unit.id === value);
    setSelectedUnit(selected || null);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: "helm" | "jasHujan") => {
    const value = e.target.value;
    setFormData({ [field]: value === "" ? 0 : parseInt(value, 10) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    
    if (!formData.namaPenyewa || !formData.noWhatsapp || !formData.unitId) {
      setError("Mohon lengkapi data wajib");
      return;
    }

    try {
      setIsLoading(true);
      await submitForm();
      setSuccess("Transaksi berhasil dibuat");
      resetForm();
    } catch (error: unknown) {
      console.error("Gagal membuat transaksi:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat transaksi";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusMessage error={error} success={success} />
      
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
                value={formData?.namaPenyewa || ""}
                onChange={(e) => setFormData({ namaPenyewa: e.target.value })}
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
                onChange={(e) => setFormData({ noWhatsapp: e.target.value })}
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
                onChange={(e) => setFormData({ alamat: e.target.value })}
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
                      onSelect={(date) => date && setFormData({ tanggalMulai: format(date, "yyyy-MM-dd") })}
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
                  onChange={(e) => setFormData({ jamMulai: e.target.value })}
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
                      onSelect={(date) => date && setFormData({ tanggalSelesai: format(date, "yyyy-MM-dd") })}
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
                  onChange={(e) => setFormData({ jamSelesai: e.target.value })}
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
                  value={formData?.helm || 0}
                  onChange={(e) => handleNumberChange(e, "helm")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jasHujan">Jumlah Jas Hujan</Label>
                <Input
                  type="number"
                  id="jasHujan"
                  name="jasHujan"
                  min={0}
                  value={formData?.jasHujan || 0}
                  onChange={(e) => handleNumberChange(e, "jasHujan")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tombol Submit */}
        <FormActions 
          isLoading={isLoading} 
          onCancel={onCancel}
          submitLabel="Simpan Transaksi"
          submitIcon={<Save className="h-4 w-4" />}
          fullWidth={true}
        />
      </div>
    </form>
  );
} 
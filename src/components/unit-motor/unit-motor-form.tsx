import React, { useEffect } from "react";
import { useUnitMotorFormStore } from "@/lib/store/unit-motor/unit-motor-store";
import { getJenisMotor } from "@/lib/api/jenis-motor";
import { formatRupiahInput } from "@/lib/helper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { FormActions } from "@/components/ui/form-actions";
import { Loader2 } from "lucide-react";

interface UnitMotorFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function UnitMotorForm({ onCancel, onSuccess }: UnitMotorFormProps) {
  const {
    formData,
    loading,
    error,
    success,
    jenisMotorOptions,
    setFormData,
    setJenisMotorOptions,
    resetMessages,
    submitForm
  } = useUnitMotorFormStore();

  useEffect(() => {
    const fetchJenisMotor = async () => {
      try {
        const data = await getJenisMotor();
        setJenisMotorOptions(data);
      } catch (error) {
        console.error("Gagal mengambil data jenis motor:", error);
      }
    };

    fetchJenisMotor();
  }, [setJenisMotorOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const success = await submitForm();
    
    if (success && onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleHargaSewaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setFormData({ hargaSewa: formatRupiahInput(parseInt(value)) });
    } else {
      setFormData({ hargaSewa: "" });
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 20 },
    (_, i) => (currentYear - i).toString()
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StatusMessage 
        error={error ? error : undefined} 
        success={success ? success : undefined} 
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plat">Plat Nomor</Label>
          <Input
            id="plat"
            placeholder="Contoh: KB 1234 XX"
            value={formData.plat}
            onChange={(e) => setFormData({ plat: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tahunPembuatan">Tahun Pembuatan</Label>
          <Select
            value={formData.tahunPembuatan}
            onValueChange={(value) => setFormData({ tahunPembuatan: value })}
            disabled={loading}
          >
            <SelectTrigger id="tahunPembuatan">
              <SelectValue placeholder="Pilih tahun pembuatan" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hargaSewa">Harga Sewa</Label>
          <Input
            id="hargaSewa"
            placeholder="Contoh: Rp 100.000"
            value={formData.hargaSewa}
            onChange={handleHargaSewaChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jenisMotor">Jenis Motor</Label>
          <Select
            value={formData.jenisMotorId}
            onValueChange={(value) => setFormData({ jenisMotorId: value })}
            disabled={loading || jenisMotorOptions.length === 0}
          >
            <SelectTrigger id="jenisMotor">
              <SelectValue placeholder="Pilih jenis motor" />
            </SelectTrigger>
            <SelectContent>
              {jenisMotorOptions.length === 0 ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Memuat...</span>
                </div>
              ) : (
                jenisMotorOptions.map((jenis) => (
                  <SelectItem key={jenis.id} value={jenis.id}>
                    {jenis.merk} {jenis.model} ({jenis.cc} CC)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormActions
        isLoading={loading}
        onCancel={onCancel}
        submitLabel="Simpan"
      />
    </form>
  );
} 
import React, { useEffect } from "react";
import { useUnitMotorEditStore } from "@/lib/store/unit-motor/unit-motor-edit-store";
import { getJenisMotor } from "@/lib/api/jenis-motor";
import { formatRupiahInput } from "@/lib/helper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { FormActions } from "@/components/ui/form-actions";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface UnitMotorEditFormProps {
  id: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function UnitMotorEditForm({ id, onCancel, onSuccess }: UnitMotorEditFormProps) {
  const {
    formData,
    loading,
    saving,
    error,
    success,
    jenisMotorOptions,
    fetchUnitMotor,
    setFormData,
    setJenisMotorOptions,
    resetMessages,
    updateUnitMotor
  } = useUnitMotorEditStore();

  // Ambil data unit motor dan jenis motor
  useEffect(() => {
    fetchUnitMotor(id);
    
    const fetchJenisMotorOptions = async () => {
      try {
        const data = await getJenisMotor();
        setJenisMotorOptions(data);
      } catch (error) {
        console.error("Gagal mengambil data jenis motor:", error);
      }
    };

    fetchJenisMotorOptions();
  }, [id, fetchUnitMotor, setJenisMotorOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const success = await updateUnitMotor(id);
    
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

  const statusOptions = [
    { value: "TERSEDIA", label: "Tersedia" },
    { value: "DISEWA", label: "Disewa" },
    { value: "PERBAIKAN", label: "Perbaikan" },
  ];

  if (loading) {
    return <LoadingIndicator message="Memuat data..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StatusMessage error={error ? error : undefined} success={success ? success : undefined} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plat">Plat Nomor</Label>
          <Input
            id="plat"
            value={formData.plat}
            onChange={(e) => setFormData({ plat: e.target.value })}
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ status: value })}
            disabled={saving}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status unit" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tahunPembuatan">Tahun Pembuatan</Label>
          <Select
            value={formData.tahunPembuatan}
            onValueChange={(value) => setFormData({ tahunPembuatan: value })}
            disabled={saving}
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

        <div className="space-y-2">
          <Label htmlFor="hargaSewa">Harga Sewa</Label>
          <Input
            id="hargaSewa"
            value={formData.hargaSewa}
            onChange={handleHargaSewaChange}
            disabled={saving}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jenisMotor">Jenis Motor</Label>
        <Select
          value={formData.jenisMotorId}
          onValueChange={(value) => setFormData({ jenisMotorId: value })}
          disabled={saving}
        >
          <SelectTrigger id="jenisMotor">
            <SelectValue placeholder="Pilih jenis motor" />
          </SelectTrigger>
          <SelectContent>
            {jenisMotorOptions.map((jenis) => (
              <SelectItem key={jenis.id} value={jenis.id}>
                {jenis.merk} {jenis.model} ({jenis.cc} CC)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FormActions
        isLoading={saving}
        onCancel={onCancel}
        submitLabel="Simpan Perubahan"
      />
    </form>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ImageIcon } from "lucide-react";
import { StatusMessage } from "@/components/jenis-motor/status-message";
import { useJenisMotorEditStore } from "@/lib/store/jenis-motor/jenis-motor-edit-store";

interface JenisMotorEditFormProps {
  id: string;
  onCancel: () => void;
}

export function JenisMotorEditForm({ id, onCancel }: JenisMotorEditFormProps) {
  const {
    jenisMotor,
    formData,
    loading,
    loadingSubmit,
    error,
    success,
    fetchJenisMotor,
    setFormData,
    setSelectedFile,
    submitForm,
  } = useJenisMotorEditStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Ambil data jenis motor saat komponen mount
  useEffect(() => {
    fetchJenisMotor(id);
  }, [id, fetchJenisMotor]);

  // Set preview gambar dari data yang sudah ada
  useEffect(() => {
    if (jenisMotor?.gambar) {
      setPreviewUrl(jenisMotor.gambar);
    }
  }, [jenisMotor]);

  // Handler untuk perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cc') {
      // Pastikan CC adalah angka
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setFormData({ [name]: numValue });
      }
    } else {
      setFormData({ [name]: value });
    }
  };

  // Handler untuk perubahan file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Membuat URL preview untuk gambar
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusMessage error={error} success={success ? "Jenis motor berhasil diperbarui" : undefined} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merk">Merk</Label>
            <Input
              id="merk"
              name="merk"
              value={formData.merk}
              onChange={handleInputChange}
              placeholder="Contoh: Honda, Yamaha, dll"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Contoh: BeAT, NMAX, dll"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              name="cc"
              type="number"
              min="50"
              value={formData.cc}
              onChange={handleInputChange}
              placeholder="Contoh: 125"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gambar</Label>
            <div className="flex flex-col gap-4">
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                  </div>
                )}
              </div>
              
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Format: JPG, PNG, atau WEBP. Ukuran maks: 2MB.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loadingSubmit}
        >
          Batal
        </Button>
        <Button type="submit" disabled={loadingSubmit}>
          {loadingSubmit ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
} 
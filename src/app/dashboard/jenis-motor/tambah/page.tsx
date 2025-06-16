"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { createJenisMotor, JenisMotor } from "@/lib/jenis-motor";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TambahJenisMotorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<Partial<JenisMotor>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Fungsi untuk menghasilkan slug dari merk dan model
  const generateSlug = (merk: string, model: string): string => {
    return `${merk} ${model}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Hapus karakter khusus
      .replace(/\s+/g, '-')     // Ganti spasi dengan tanda -
      .replace(/-+/g, '-')      // Hindari tanda - berulang
      .trim();                  // Hapus spasi di awal dan akhir
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.merk || !formData.model || !formData.cc) {
      setError("Semua field harus diisi");
      return;
    }
    
    if (isNaN(Number(formData.cc)) || Number(formData.cc) < 50) {
      setError("CC motor minimal 50");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
            
      if (selectedFile) {
        // Jika ada file, gunakan FormData
        const submitData = new FormData();
        submitData.append("merk", formData.merk);
        submitData.append("model", formData.model);
        submitData.append("cc", formData.cc.toString());
        
        // Buat slug otomatis dari merk dan model
        const slug = generateSlug(formData.merk, formData.model);
        submitData.append("slug", slug);
        submitData.append("file", selectedFile);
        
        // Kirim data ke server
        await createJenisMotor(submitData);
      } else {
        // Jika tidak ada file, kirim data sebagai JSON (lebih aman untuk tipe data)
        const jsonData = {
          merk: formData.merk,
          model: formData.model,
          cc: formData.cc, // Kirim sebagai number, bukan string
          slug: generateSlug(formData.merk, formData.model)
        };
        
        // Kirim data ke server
        await createJenisMotor(jsonData);
      }
      
      setSuccess("Jenis motor berhasil ditambahkan");
      
      // Reset form
      setFormData({
        merk: "",
        model: "",
        cc: 0,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Redirect ke halaman jenis motor setelah 2 detik
      setTimeout(() => {
        router.push("/dashboard/jenis-motor");
      }, 2000);
      
    } catch (error: any) {
      console.error("Gagal menambahkan jenis motor:", error);
      setError(`Gagal membuat jenis motor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => router.push("/dashboard/jenis-motor")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Tambah Jenis Motor Baru
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Tambahkan jenis motor baru ke dalam sistem
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Jenis Motor</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 flex items-center rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="mr-2 h-5 w-5" />
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="merk"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Merk <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="merk"
                    name="merk"
                    placeholder="Honda, Yamaha, dll"
                    value={formData.merk}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor="model"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Model <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="Vario 125, CBR 150, dll"
                    value={formData.model}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor="cc"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    CC <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="cc"
                    name="cc"
                    type="number"
                    placeholder="125"
                    min={50}
                    value={formData.cc}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-neutral-500">
                    Minimal CC motor adalah 50
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label
                  htmlFor="gambar"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Gambar (Opsional)
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mt-1 flex justify-center rounded-lg border border-dashed border-neutral-300 px-6 py-10 dark:border-neutral-700">
                      <div className="text-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto mb-4 h-32 w-auto rounded"
                          />
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                          <label
                            htmlFor="gambar"
                            className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <span>Pilih file</span>
                            <Input
                              id="gambar"
                              name="gambar"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                              disabled={loading}
                            />
                          </label>
                          <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          PNG, JPG, GIF hingga 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Ketentuan upload gambar:
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                      <li>Format file: JPG, PNG, atau GIF</li>
                      <li>Ukuran maksimal: 5MB</li>
                      <li>Resolusi yang disarankan: 800x600 piksel</li>
                      <li>Rasio aspek: 4:3 atau 16:9</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/jenis-motor")}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 
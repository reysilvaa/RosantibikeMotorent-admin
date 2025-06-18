import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { FormActions } from "@/components/ui/form-actions";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAdminEditStore } from "@/lib/store/admin/admin-edit-store";

interface AdminEditFormProps {
  id: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AdminEditForm({ id, onCancel, onSuccess }: AdminEditFormProps) {
  const {
    formData,
    loading,
    saving,
    error,
    success,
    fetchAdmin,
    setFormData,
    resetMessages,
    submitForm
  } = useAdminEditStore();

  // Ambil data admin saat komponen mount
  useEffect(() => {
    fetchAdmin(id);
  }, [id, fetchAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const success = await submitForm(id);
    
    if (success && onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Memuat data admin..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusMessage error={error} success={success} />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama</Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => setFormData({ nama: e.target.value })}
            placeholder="Masukkan nama admin"
            disabled={saving}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ username: e.target.value })}
            placeholder="Masukkan username"
            disabled={saving}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password Baru (opsional)</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            placeholder="Kosongkan jika tidak ingin mengubah password"
            disabled={saving}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Kosongkan jika tidak ingin mengubah password
          </p>
        </div>
      </div>
      
      <FormActions
        isLoading={saving}
        onCancel={onCancel}
        submitLabel="Simpan Perubahan"
      />
    </form>
  );
} 
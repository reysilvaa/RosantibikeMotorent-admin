import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { FormActions } from "@/components/ui/form-actions";
import { useAdminFormStore } from "@/lib/store/admin/admin-form-store";

interface AdminFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AdminForm({ onCancel, onSuccess }: AdminFormProps) {
  const {
    formData,
    loading,
    error,
    success,
    setFormData,
    resetMessages,
    submitForm
  } = useAdminFormStore();

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
            disabled={loading}
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
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            placeholder="Masukkan password"
            disabled={loading}
            required
          />
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
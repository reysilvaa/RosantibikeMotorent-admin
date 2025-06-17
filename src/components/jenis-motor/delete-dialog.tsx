"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
        <h3 className="text-lg font-medium">Konfirmasi Hapus</h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Apakah Anda yakin ingin menghapus jenis motor ini? Tindakan ini
          tidak dapat dibatalkan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 
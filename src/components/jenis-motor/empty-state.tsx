"use client";

import React from "react";
import { ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  isSearching: boolean;
  onAdd: () => void;
}

export function EmptyState({ isSearching, onAdd }: EmptyStateProps) {
  return (
    <div className="col-span-full flex h-96 items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div>
        <ImageIcon className="mx-auto h-10 w-10 text-neutral-400" />
        <h3 className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {isSearching
            ? "Tidak ada jenis motor yang sesuai dengan pencarian"
            : "Belum ada data jenis motor"}
        </h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {isSearching
            ? "Coba kata kunci lain atau reset pencarian"
            : "Mulai dengan menambahkan jenis motor baru"}
        </p>
        {!isSearching && (
          <Button onClick={onAdd} className="mt-4" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Tambah Jenis Motor
          </Button>
        )}
      </div>
    </div>
  );
} 
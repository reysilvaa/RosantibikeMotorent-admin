"use client";

import React from "react";
import Image from "next/image";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JenisMotor } from "@/lib/types/jenis-motor";

interface JenisMotorCardProps {
  jenis: JenisMotor;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function JenisMotorCard({ jenis, onEdit, onDelete }: JenisMotorCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800">
        {jenis.gambar ? (
          <Image
            src={jenis.gambar}
            alt={`${jenis.merk} ${jenis.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{jenis.merk} {jenis.model}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {jenis.cc} CC
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(jenis.id)}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
            onClick={() => onDelete(jenis.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
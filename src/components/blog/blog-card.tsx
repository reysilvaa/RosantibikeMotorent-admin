import React from "react";
import Image from "next/image";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BlogStatus } from "@/lib/types/blog";

interface BlogCardProps {
  id?: string;
  judul: string;
  thumbnail?: string;
  status: BlogStatus;
  kategori?: string;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function BlogCard({
  judul,
  thumbnail,
  status,
  kategori,
  createdAt,
  onEdit,
  onDelete,
  className = "",
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getStatusVariant = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return "success";
      case BlogStatus.DRAFT:
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={judul}
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
        <h3 className="font-semibold line-clamp-2">{judul}</h3>
        <div className="mt-2 flex items-center gap-2">
          <StatusBadge 
            status={status === BlogStatus.PUBLISHED ? "Terbit" : "Draft"} 
            variant={getStatusVariant(status)}
            size="small"
          />
          {kategori && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {kategori}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {formatDate(createdAt)}
        </p>
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
              onClick={onDelete}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Hapus
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
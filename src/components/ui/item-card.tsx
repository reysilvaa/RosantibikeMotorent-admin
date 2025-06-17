import React from "react";
import Image from "next/image";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ItemCardProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
  actionButtons?: React.ReactNode;
}

export function ItemCard({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Image",
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Hapus",
  className = "",
  actionButtons,
}: ItemCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
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
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        )}
        <div className="mt-4 flex gap-2">
          {actionButtons ? (
            actionButtons
          ) : (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onEdit}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  {editLabel}
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
                  {deleteLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
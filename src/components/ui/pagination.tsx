import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalData: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalData,
  limit,
  onPageChange,
  className = "",
}: PaginationProps) {
  const { isMobile } = useIsMobile();
  
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalData);

  return (
    <div className={`mt-4 flex flex-col gap-2 border-t pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
        Menampilkan {startItem}-{endItem} dari {totalData} item
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2 md:px-3"
        >
          {isMobile ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            "Sebelumnya"
          )}
        </Button>
        
        {!isMobile && Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, i, arr) => (
            <React.Fragment key={page}>
              {i > 0 && arr[i - 1] !== page - 1 && (
                <Button variant="outline" size="sm" disabled className="h-8 w-8">
                  ...
                </Button>
              )}
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8"
              >
                {page}
              </Button>
            </React.Fragment>
          ))}
          
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 px-2"
          >
            {currentPage} / {totalPages}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2 md:px-3"
        >
          {isMobile ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            "Selanjutnya"
          )}
        </Button>
      </div>
    </div>
  );
} 
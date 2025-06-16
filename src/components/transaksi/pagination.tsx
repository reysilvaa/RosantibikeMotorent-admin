import { Button } from "@/components/ui/button";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalData: number;
  limit: number;
  handlePageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalData,
  limit,
  handlePageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4 dark:border-neutral-800">
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        Menampilkan {(currentPage - 1) * limit + 1}-
        {Math.min(currentPage * limit, totalData)} dari{" "}
        {totalData} transaksi
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Sebelumnya
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, i, arr) => (
            <React.Fragment key={page}>
              {i > 0 && arr[i - 1] !== page - 1 && (
                <Button variant="outline" size="sm" disabled>
                  ...
                </Button>
              )}
              <Button
                variant={
                  currentPage === page ? "default" : "outline"
                }
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            </React.Fragment>
          ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
} 
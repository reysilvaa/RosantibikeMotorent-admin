"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransaksi, StatusTransaksi, FilterTransaksi, Transaksi } from "@/lib/transaksi";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TransaksiHeader } from "@/components/transaksi/transaksi-header";
import { TransaksiSearch } from "@/components/transaksi/transaksi-search";
import { TransaksiFilters } from "@/components/transaksi/transaksi-filters";
import { TransaksiTable } from "@/components/transaksi/transaksi-table";
import { Pagination } from "@/components/transaksi/pagination";
import { LoadingIndicator } from "@/components/transaksi/loading-indicator";

export default function TransaksiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTransaksi | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 10;

  const fetchTransaksi = async (page = 1, filter: FilterTransaksi = {}) => {
    try {
      setLoading(true);
      const params: FilterTransaksi = {
        page,
        limit,
        ...filter,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await getTransaksi(params);
      setTransaksi(response.data);
      setTotalData(response.meta.totalItems || 0);
      setTotalPages(Math.ceil((response.meta.totalItems || 0) / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi(1);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransaksi(1);
  };

  const handleStatusFilterChange = (status: StatusTransaksi | "") => {
    setStatusFilter(status);
    fetchTransaksi(1, { status: status || undefined });
  };

  const handlePageChange = (page: number) => {
    fetchTransaksi(page);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("");
    fetchTransaksi(1, {});
  };

  const handleDetailClick = (id: string) => {
    router.push(`/dashboard/transaksi/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <TransaksiHeader 
          title="Daftar Transaksi" 
          description="Kelola semua transaksi rental motor" 
        />

        <Card>
          <CardHeader className="pb-3">
            <TransaksiSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              handleResetFilter={handleResetFilter}
            />
          </CardHeader>
          <CardContent>
            <TransaksiFilters
              statusFilter={statusFilter}
              handleStatusFilterChange={handleStatusFilterChange}
            />

            {loading ? (
              <LoadingIndicator />
            ) : (
              <>
                <TransaksiTable
                  transaksi={transaksi}
                  handleDetailClick={handleDetailClick}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalData={totalData}
                  limit={limit}
                  handlePageChange={handlePageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 
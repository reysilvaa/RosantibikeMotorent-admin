"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Bike,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { getTransaksi, StatusTransaksi } from "@/lib/transaksi";
import { getUnitMotor } from "@/lib/unit-motor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Interface untuk data statistik
interface StatistikData {
  totalTransaksi: number;
  pendapatanBulanIni: number;
  motorTersedia: number;
  transaksiPending: number;
  dataTransaksi: Array<{
    id: string;
    namaPenyewa: string;
    noHP: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: StatusTransaksi;
    totalHarga: number;
    unitMotor?: {
      plat: string;
      jenisMotor?: {
        nama: string;
      };
    };
  }>;
  dataTransaksiBulan: Array<{
    bulan: string;
    jumlah: number;
  }>;
  dataStatusMotor: Array<{
    status: string;
    jumlah: number;
  }>;
}

// Komponen Card Info
const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {title}
      </CardTitle>
      <div className="rounded-full bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && trendValue && (
        <p
          className={`mt-1 flex items-center text-xs ${
            trend === "up"
              ? "text-green-600 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="mr-1 h-3 w-3" />
          ) : (
            <ArrowUpRight className="mr-1 h-3 w-3 rotate-90" />
          )}
          {trendValue}
        </p>
      )}
    </CardContent>
  </Card>
);

// Warna untuk chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statistik, setStatistik] = useState<StatistikData>({
    totalTransaksi: 0,
    pendapatanBulanIni: 0,
    motorTersedia: 0,
    transaksiPending: 0,
    dataTransaksi: [],
    dataTransaksiBulan: [],
    dataStatusMotor: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mendapatkan data transaksi
        const resTransaksi = await getTransaksi({ limit: 100 });
        
        // Mendapatkan data unit motor
        const resUnitMotor = await getUnitMotor({ limit: 100 });
        
        // Menghitung total pendapatan bulan ini
        const tanggalSekarang = new Date();
        const bulanIni = tanggalSekarang.getMonth();
        const tahunIni = tanggalSekarang.getFullYear();
        
        const transaksiSelesaiBulanIni = resTransaksi.data.filter(
          (transaksi) => {
            const tanggalTransaksi = new Date(transaksi.updatedAt);
            return (
              transaksi.status === StatusTransaksi.SELESAI &&
              tanggalTransaksi.getMonth() === bulanIni &&
              tanggalTransaksi.getFullYear() === tahunIni
            );
          }
        );
        
        const pendapatanBulanIni = transaksiSelesaiBulanIni.reduce(
          (total, transaksi) => total + Number(transaksi.totalBiaya),
          0
        );
        
        // Menghitung jumlah motor tersedia
        const motorTersedia = resUnitMotor.data.filter(
          (motor) => motor.status === "TERSEDIA"
        ).length;
        
        // Menghitung transaksi pending (Booking dan Berjalan)
        const transaksiPending = resTransaksi.data.filter(
          (transaksi) =>
            transaksi.status === StatusTransaksi.BOOKING ||
            transaksi.status === StatusTransaksi.BERJALAN ||
            transaksi.status === StatusTransaksi.AKTIF
        ).length;
        
        // Data untuk chart transaksi per bulan
        const dataPerBulan = new Array(12).fill(0);
        
        resTransaksi.data.forEach((transaksi) => {
          const tanggalTransaksi = new Date(transaksi.createdAt);
          if (tanggalTransaksi.getFullYear() === tahunIni) {
            dataPerBulan[tanggalTransaksi.getMonth()]++;
          }
        });
        
        const namaBulan = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ];
        
        const dataTransaksiBulan = dataPerBulan.map((jumlah, index) => ({
          bulan: namaBulan[index],
          jumlah,
        }));
        
        // Data untuk chart status motor
        const motorStatus = {
          TERSEDIA: 0,
          DISEWA: 0,
          DIPESAN: 0,
          OVERDUE: 0,
        };
        
        resUnitMotor.data.forEach((motor) => {
          if (motor.status in motorStatus) {
            motorStatus[motor.status as keyof typeof motorStatus]++;
          }
        });
        
        const dataStatusMotor = Object.entries(motorStatus).map(
          ([status, jumlah]) => ({
            status,
            jumlah,
          })
        );
        
        setStatistik({
          totalTransaksi: resTransaksi.meta.totalItems,
          pendapatanBulanIni,
          motorTersedia,
          transaksiPending,
          dataTransaksi: resTransaksi.data.slice(0, 5).map(transaksi => ({
            id: transaksi.id,
            namaPenyewa: transaksi.namaPenyewa,
            noHP: transaksi.noWhatsapp,
            tanggalMulai: transaksi.tanggalMulai,
            tanggalSelesai: transaksi.tanggalSelesai,
            status: transaksi.status,
            totalHarga: Number(transaksi.totalBiaya),
            unitMotor: transaksi.unitMotor ? {
              plat: transaksi.unitMotor.platNomor,
              jenisMotor: transaksi.unitMotor.jenis ? {
                nama: `${transaksi.unitMotor.jenis?.merk} ${transaksi.unitMotor.jenis?.model}`
              } : undefined
            } : undefined
          })),
          dataTransaksiBulan,
          dataStatusMotor,
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Ringkasan dan statistik dari sistem rental motor
          </p>
        </div>
        
        {loading ? (
          <div className="grid h-96 place-items-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-lg font-medium">Memuat data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Transaksi"
                value={statistik.totalTransaksi}
                icon={<ShoppingCart className="h-4 w-4" />}
                trend="up"
                trendValue="12% dari bulan lalu"
              />
              <StatCard
                title="Pendapatan Bulan Ini"
                value={formatRupiah(statistik.pendapatanBulanIni)}
                icon={<TrendingUp className="h-4 w-4" />}
                trend="up"
                trendValue="8% dari bulan lalu"
              />
              <StatCard
                title="Motor Tersedia"
                value={statistik.motorTersedia}
                icon={<Bike className="h-4 w-4" />}
              />
              <StatCard
                title="Transaksi Pending"
                value={statistik.transaksiPending}
                icon={<Clock className="h-4 w-4" />}
                trend={statistik.transaksiPending > 5 ? "up" : "down"}
                trendValue={
                  statistik.transaksiPending > 5
                    ? "Perlu perhatian"
                    : "Normal"
                }
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Transaksi per Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statistik.dataTransaksiBulan}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bulan" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="jumlah"
                          fill="#3b82f6"
                          name="Jumlah Transaksi"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Status Motor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statistik.dataStatusMotor}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="jumlah"
                          nameKey="status"
                        >
                          {statistik.dataStatusMotor.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left">
                    <thead>
                      <tr className="border-b text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                        <th className="px-4 py-3">Penyewa</th>
                        <th className="px-4 py-3">Motor</th>
                        <th className="px-4 py-3">Mulai</th>
                        <th className="px-4 py-3">Selesai</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistik.dataTransaksi.length > 0 ? (
                        statistik.dataTransaksi.map((transaksi) => (
                          <tr
                            key={transaksi.id}
                            className="border-b text-sm dark:border-neutral-800"
                          >
                            <td className="px-4 py-3 font-medium">
                              {transaksi.namaPenyewa}
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {transaksi.noHP}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {transaksi.unitMotor?.jenisMotor?.nama || "-"}
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {transaksi.unitMotor?.plat || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {formatTanggal(transaksi.tanggalMulai)}
                            </td>
                            <td className="px-4 py-3">
                              {formatTanggal(transaksi.tanggalSelesai)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  transaksi.status === StatusTransaksi.SELESAI
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : transaksi.status === StatusTransaksi.BERJALAN
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : transaksi.status === StatusTransaksi.BOOKING
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : transaksi.status === StatusTransaksi.BATAL
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : transaksi.status === StatusTransaksi.OVERDUE
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" 
                                    : "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400"
                                }`}
                              >
                                {transaksi.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {formatRupiah(transaksi.totalHarga)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                          >
                            Belum ada data transaksi
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 
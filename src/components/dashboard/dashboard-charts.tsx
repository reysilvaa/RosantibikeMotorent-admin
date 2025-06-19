import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionChart } from "./chart/transaction-chart";
import { StatusMotorChart } from "./chart/status-motor-chart";

interface DashboardChartsProps {
  dataTransaksiBulan: Array<{ bulan: string; jumlah: number }>;
  dataStatusMotor: Array<{ status: string; jumlah: number }>;
}

export function DashboardCharts({
  dataTransaksiBulan,
  dataStatusMotor,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 overflow-hidden">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="px-4 py-3 md:px-5 md:py-4 pb-2 border-b border-slate-800/50">
          <CardTitle className="text-base md:text-lg font-medium">Transaksi per Bulan</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-2 md:px-5 md:pt-4 md:pb-3">
          <div className="h-64 sm:h-72 md:h-80 w-full">
            <TransactionChart data={dataTransaksiBulan} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="px-4 py-3 md:px-5 md:py-4 pb-2 border-b border-slate-800/50">
          <CardTitle className="text-base md:text-lg font-medium">Status Motor</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-2 md:px-5 md:pt-4 md:pb-3">
          <div className="h-64 sm:h-72 md:h-80 w-full">
            <StatusMotorChart data={dataStatusMotor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
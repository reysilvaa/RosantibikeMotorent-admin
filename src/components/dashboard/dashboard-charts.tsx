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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="px-4 py-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Transaksi per Bulan</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4 md:px-6">
          <div className="h-64 md:h-80">
            <TransactionChart data={dataTransaksiBulan} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-4 py-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Status Motor</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4 md:px-6">
          <div className="h-64 md:h-80">
            <StatusMotorChart data={dataStatusMotor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
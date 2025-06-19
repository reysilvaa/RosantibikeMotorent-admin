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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-hidden">
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-4 md:px-5 pb-3">
          <CardTitle className="text-base md:text-lg">Transaksi per Bulan</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 md:px-5">
          <div className="h-56 md:h-72 w-full">
            <TransactionChart data={dataTransaksiBulan} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-4 md:px-5 pb-3">
          <CardTitle className="text-base md:text-lg">Status Motor</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 md:px-5">
          <div className="h-56 md:h-72 w-full">
            <StatusMotorChart data={dataStatusMotor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
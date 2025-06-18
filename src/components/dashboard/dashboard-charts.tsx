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
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transaksi per Bulan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <TransactionChart data={dataTransaksiBulan} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Status Motor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <StatusMotorChart data={dataStatusMotor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
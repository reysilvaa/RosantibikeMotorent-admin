import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusMotorChart } from './chart/status-motor-chart';
import { TransactionChart } from './chart/transaction-chart';

interface DashboardChartsProps {
  dataTransaksiBulan: Array<{ bulan: string; jumlah: number }>;
  dataStatusMotor: Array<{ status: string; jumlah: number }>;
}

export function DashboardCharts({
  dataTransaksiBulan,
  dataStatusMotor,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 overflow-hidden md:grid-cols-2">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="border-b border-slate-800/50 px-4 py-3 pb-2 md:px-5 md:py-4">
          <CardTitle className="text-base font-medium md:text-lg">
            Transaksi per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-2 md:px-5 md:pt-4 md:pb-3">
          <div className="h-64 w-full sm:h-72 md:h-80">
            <TransactionChart data={dataTransaksiBulan} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardHeader className="border-b border-slate-800/50 px-4 py-3 pb-2 md:px-5 md:py-4">
          <CardTitle className="text-base font-medium md:text-lg">
            Status Motor
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-2 md:px-5 md:pt-4 md:pb-3">
          <div className="h-64 w-full sm:h-72 md:h-80">
            <StatusMotorChart data={dataStatusMotor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

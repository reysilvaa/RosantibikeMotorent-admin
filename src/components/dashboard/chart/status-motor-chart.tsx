import React from "react";
import { DonutChart } from "../../ui/chart";

interface StatusMotorChartProps {
  data: Array<{ status: string; jumlah: number }>;
}

export function StatusMotorChart({ data }: StatusMotorChartProps) {
  const chartData = data.map(item => ({
    label: item.status,
    value: item.jumlah
  }));

  return (
    <div className="w-full overflow-hidden">
    <DonutChart
      data={chartData}
      height={300}
      formatter={(value) => `${value} unit`}
    />
    </div>
  );
}

// Fungsi untuk mendapatkan data status motor
export function getDataStatusMotor(unitMotorData: Array<{status: string}>) {
  const motorStatus = {
    TERSEDIA: 0,
    DISEWA: 0,
    DIPESAN: 0,
    OVERDUE: 0,
  };
  
  unitMotorData.forEach((motor) => {
    if (motor.status in motorStatus) {
      motorStatus[motor.status as keyof typeof motorStatus]++;
    }
  });
  
  return Object.entries(motorStatus).map(
    ([status, jumlah]) => ({
      status,
      jumlah,
    })
  );
} 
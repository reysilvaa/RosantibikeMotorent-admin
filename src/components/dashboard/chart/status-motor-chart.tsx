import React from "react";
import { PieChart } from "../../ui/chart";

interface StatusMotorChartProps {
  data: Array<{ status: string; jumlah: number }>;
}

export function StatusMotorChart({ data }: StatusMotorChartProps) {
  const chartData = data.map(item => ({
    label: item.status,
    value: item.jumlah
  }));

  // Warna yang berbeda untuk setiap status motor
  const statusColors = {
    'TERSEDIA': '#10b981', // hijau
    'DISEWA': '#f97316',   // oranye
    'DIPESAN': '#6366f1',  // indigo
    'OVERDUE': '#ef4444',  // merah
  };

  // Memetakan warna berdasarkan label
  const colors = chartData.map(item => 
    statusColors[item.label as keyof typeof statusColors] || '#8b5cf6'
  );

  return (
    <div className="w-full h-full overflow-hidden">
      <PieChart
        data={chartData}
        height={300}
        formatter={(value) => `${value} unit`}
        colors={colors}
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
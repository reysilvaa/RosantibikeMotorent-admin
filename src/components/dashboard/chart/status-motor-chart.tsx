import React from 'react';
import { PieChart } from '../../ui/chart';

interface StatusMotorChartProps {
  data: Array<{ status: string; jumlah: number }>;
}

export function StatusMotorChart({ data }: StatusMotorChartProps) {
  const chartData = data.map(item => ({
    label: item.status,
    value: item.jumlah,
  }));

  const statusColors = {
    TERSEDIA: '#10b981',
    DISEWA: '#f97316',
    DIPESAN: '#6366f1',
    OVERDUE: '#ef4444',
  };

  const colors = chartData.map(
    item => statusColors[item.label as keyof typeof statusColors] || '#8b5cf6'
  );

  return (
    <div className="h-full w-full overflow-hidden">
      <PieChart
        colors={colors}
        data={chartData}
        formatter={value => `${value} unit`}
        height={300}
      />
    </div>
  );
}

export function getDataStatusMotor(unitMotorData: Array<{ status: string }>) {
  const motorStatus = {
    TERSEDIA: 0,
    DISEWA: 0,
    DIPESAN: 0,
    OVERDUE: 0,
  };

  unitMotorData.forEach(motor => {
    if (motor.status in motorStatus) {
      motorStatus[motor.status as keyof typeof motorStatus]++;
    }
  });

  return Object.entries(motorStatus).map(([status, jumlah]) => ({
    status,
    jumlah,
  }));
}

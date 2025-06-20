import React from 'react';
import { BarChart } from '../../ui/chart';

interface TransactionChartProps {
  data: Array<{ bulan: string; jumlah: number }>;
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = data.map(item => ({
    label: item.bulan,
    value: item.jumlah,
  }));

  return (
    <div className="h-full w-full overflow-hidden">
      <BarChart
        data={chartData}
        height={300}
        formatter={value => `${value} transaksi`}
        title="Transaksi"
        colors={['#6366f1', '#8b5cf6']}
      />
    </div>
  );
}

export function getDataTransaksiBulan(
  transaksiData: Array<{ createdAt: string }>,
  tahunIni: number
) {
  const dataPerBulan = new Array(12).fill(0);

  transaksiData.forEach(transaksi => {
    const tanggalTransaksi = new Date(transaksi.createdAt);
    if (tanggalTransaksi.getFullYear() === tahunIni) {
      dataPerBulan[tanggalTransaksi.getMonth()]++;
    }
  });

  const namaBulan = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return dataPerBulan.map((jumlah, index) => ({
    bulan: namaBulan[index],
    jumlah,
  }));
}

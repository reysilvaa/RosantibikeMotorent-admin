"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Transaksi, StatusTransaksi } from "@/lib/transaksi";
import { cn } from "@/lib/utils";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { useTransaksiListStore } from "@/lib/store/transaksi/transaksi-store";

// Fungsi untuk mendapatkan warna berdasarkan status transaksi
const getStatusColor = (status: StatusTransaksi) => {
  switch (status) {
    case StatusTransaksi.AKTIF:
      return "bg-green-100 border-green-300 text-green-800";
    case StatusTransaksi.BOOKING:
      return "bg-blue-100 border-blue-300 text-blue-800";
    case StatusTransaksi.BERJALAN:
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    case StatusTransaksi.SELESAI:
      return "bg-gray-100 border-gray-300 text-gray-800";
    case StatusTransaksi.BATAL:
      return "bg-red-100 border-red-300 text-red-800";
    case StatusTransaksi.OVERDUE:
      return "bg-purple-100 border-purple-300 text-purple-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
};

// Komponen untuk menampilkan event transaksi dalam kalender
const TransaksiEvent = React.memo(({ transaksi }: { transaksi: Transaksi }) => {
  return (
    <div className={cn(
      "px-2 py-1 rounded text-xs mb-1",
      getStatusColor(transaksi.status)
    )}>
      <div className="flex items-center gap-1">
        <span>{transaksi.jamMulai} - {transaksi.jamSelesai}</span>
        {transaksi.status === StatusTransaksi.AKTIF && <Check className="h-3 w-3" />}
      </div>
      <div className="font-medium">{transaksi.namaPenyewa}</div>
      <div className="text-[10px]">{transaksi.unitMotor.platNomor} • {transaksi.unitMotor.jenis?.model}</div>
    </div>
  );
});

TransaksiEvent.displayName = "TransaksiEvent";

// Komponen hari kalender
const CalendarDay = React.memo(({ 
  day, 
  transaksiForDate, 
  isToday 
}: { 
  day: Date; 
  transaksiForDate: Transaksi[];
  isToday: boolean;
}) => {
  return (
    <div 
      className={cn(
        "border-r last:border-r-0 border-b p-1 min-h-[100px]",
        isToday ? "bg-blue-50" : ""
      )}
    >
      <div className="font-medium text-right mb-1">
        {format(day, 'd')}
      </div>
      
      {transaksiForDate.length === 0 ? (
        <div className="text-xs text-gray-400 text-center mt-4">
          Tidak ada booking
        </div>
      ) : (
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {transaksiForDate.map((transaksi) => (
            <TransaksiEvent 
              key={transaksi.id} 
              transaksi={transaksi} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

CalendarDay.displayName = "CalendarDay";

// Komponen header kalender
const CalendarHeader = React.memo(({ 
  currentDate, 
  goToPreviousMonth, 
  goToToday, 
  goToNextMonth,
  totalBookings
}: {
  currentDate: Date;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  goToNextMonth: () => void;
  totalBookings: number;
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Data Booking</h2>
        <div className="text-sm text-gray-500">
          Menampilkan {totalBookings} dari {totalBookings} booking
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {format(currentDate, 'MMMM yyyy', { locale: id })}
        </h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={goToToday}
          >
            Hari Ini
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

CalendarHeader.displayName = "CalendarHeader";

// Komponen utama kalender
export function TransaksiCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { 
    transaksi: transaksiData, 
    loading: isLoading, 
    fetchTransaksi 
  } = useTransaksiListStore();
  
  // Mendapatkan tanggal awal dan akhir bulan
  const firstDayOfMonth = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const lastDayOfMonth = useMemo(() => endOfMonth(currentDate), [currentDate]);
  
  // Mendapatkan semua hari dalam bulan
  const daysInMonth = useMemo(() => 
    eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth }), 
    [firstDayOfMonth, lastDayOfMonth]
  );
  
  // Mendapatkan hari pertama dalam minggu (0 = Minggu, 1 = Senin, dst.)
  const startDay = useMemo(() => getDay(firstDayOfMonth), [firstDayOfMonth]);
  
  // Nama hari dalam bahasa Indonesia
  const dayNames = useMemo(() => ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], []);
  
  // Fungsi untuk navigasi bulan
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Fungsi untuk mendapatkan transaksi pada tanggal tertentu
  const getTransaksiForDate = (date: Date) => {
    return transaksiData.filter(transaksi => {
      try {
        const startDate = parseISO(transaksi.tanggalMulai);
        const endDate = parseISO(transaksi.tanggalSelesai);
        return date >= startDate && date <= endDate;
      } catch {
        return false;
      }
    });
  };
  
  // Effect untuk memuat data transaksi ketika komponen dimount atau filter berubah
  useEffect(() => {
    // Format tanggal untuk API
    const startDateStr = format(firstDayOfMonth, 'yyyy-MM-dd');
    const endDateStr = format(lastDayOfMonth, 'yyyy-MM-dd');
    
    // Panggil API untuk mendapatkan data transaksi dengan filter tanggal
    fetchTransaksi(1, {
      startDate: startDateStr,
      endDate: endDateStr,
      limit: 100 // Meningkatkan limit untuk mendapatkan lebih banyak data
    });
  }, [currentDate, fetchTransaksi, firstDayOfMonth, lastDayOfMonth]);
  
  // Mendapatkan jumlah transaksi
  const totalBookings = transaksiData.length;
  
  // Membuat array untuk sel kosong sebelum hari pertama bulan
  const emptyCellsBefore = useMemo(() => 
    Array.from({ length: startDay }).map((_, index) => (
      <div 
        key={`empty-start-${index}`} 
        className="border-r last:border-r-0 border-b p-1 min-h-[100px] bg-gray-50"
      />
    )),
    [startDay]
  );
  
  // Membuat array untuk sel kosong setelah hari terakhir bulan
  const emptyCellsAfter = useMemo(() => 
    Array.from({ length: 42 - (daysInMonth.length + startDay) }).map((_, index) => (
      <div 
        key={`empty-end-${index}`} 
        className="border-r last:border-r-0 border-b p-1 min-h-[100px] bg-gray-50"
      />
    )),
    [daysInMonth.length, startDay]
  );
  
  // Membuat array untuk hari-hari dalam bulan
  const calendarDays = useMemo(() => 
    daysInMonth.map((day, index) => {
      const transaksiForDate = getTransaksiForDate(day);
      const isToday = isSameDay(day, new Date());
      
      return (
        <CalendarDay
          key={index}
          day={day}
          transaksiForDate={transaksiForDate}
          isToday={isToday}
        />
      );
    }),
    [daysInMonth, transaksiData]
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <CalendarHeader
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToToday={goToToday}
        goToNextMonth={goToNextMonth}
        totalBookings={totalBookings}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="divide-y">
          {/* Header Hari */}
          <div className="grid grid-cols-7">
            {dayNames.map((day, index) => (
              <div 
                key={index} 
                className="p-2 text-center font-medium text-sm text-gray-600 border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid Kalender */}
          <div className="grid grid-cols-7">
            {emptyCellsBefore}
            {calendarDays}
            {emptyCellsAfter}
          </div>
        </div>
      )}
    </div>
  );
} 
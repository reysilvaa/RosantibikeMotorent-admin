"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Transaksi, StatusTransaksi } from "@/lib/transaksi";
import { cn } from "@/lib/utils";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { useTransaksiListStore } from "@/lib/store/transaksi/transaksi-store";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

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
      "px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs mb-1",
      getStatusColor(transaksi.status)
    )}>
      <div className="flex items-center gap-1">
        <span>{transaksi.jamMulai} - {transaksi.jamSelesai}</span>
        {transaksi.status === StatusTransaksi.AKTIF && <Check className="h-2 w-2 sm:h-3 sm:w-3" />}
      </div>
      <div className="font-medium truncate">{transaksi.namaPenyewa}</div>
      <div className="text-[8px] sm:text-[10px] truncate">{transaksi.unitMotor.platNomor} • {transaksi.unitMotor.jenis?.model}</div>
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
        "border-r last:border-r-0 border-b p-1 min-h-[80px] sm:min-h-[100px]",
        isToday ? "bg-blue-50" : ""
      )}
    >
      <div className="font-medium text-right mb-1 text-xs sm:text-sm">
        {format(day, 'd')}
      </div>
      
      {transaksiForDate.length === 0 ? (
        <div className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 sm:mt-4">
          Tidak ada booking
        </div>
      ) : (
        <div className="space-y-1 max-h-[160px] sm:max-h-[200px] overflow-y-auto">
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
    <div className="p-2 sm:p-4 border-b">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-1">
        <h2 className="text-base sm:text-xl font-semibold">Data Booking</h2>
        <div className="text-xs sm:text-sm text-gray-500">
          Menampilkan {totalBookings} dari {totalBookings} booking
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-sm sm:text-lg font-medium truncate max-w-[120px] sm:max-w-none">
          {format(currentDate, 'MMMM yyyy', { locale: id })}
        </h3>
        
        <div className="flex gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 sm:h-8 px-1.5 sm:px-3 text-xs"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 sm:h-8 px-1.5 sm:px-3 text-xs"
            onClick={goToToday}
          >
            Hari Ini
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 sm:h-8 px-1.5 sm:px-3 text-xs"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
        className="border-r last:border-r-0 border-b p-1 min-h-[80px] bg-gray-50"
      />
    )),
    [startDay]
  );
  
  // Membuat array untuk sel kosong setelah hari terakhir bulan
  const emptyCellsAfter = useMemo(() => 
    Array.from({ length: 42 - (daysInMonth.length + startDay) }).map((_, index) => (
      <div 
        key={`empty-end-${index}`} 
        className="border-r last:border-r-0 border-b p-1 min-h-[80px] bg-gray-50"
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
    [daysInMonth, getTransaksiForDate]
  );
  
  if (isLoading) {
    return <LoadingIndicator message="Memuat data..." />;
  }
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <CalendarHeader 
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToToday={goToToday}
        goToNextMonth={goToNextMonth}
        totalBookings={totalBookings}
      />
      
      <div className="overflow-auto flex-1">
        <div className="min-w-full">
          {/* Header hari */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          
          {/* Kalender */}
          <div className="grid grid-cols-7">
            {emptyCellsBefore}
            {calendarDays}
            {emptyCellsAfter}
          </div>
        </div>
      </div>
    </div>
  );
} 
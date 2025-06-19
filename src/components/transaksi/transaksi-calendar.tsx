"use client";

import React, { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useTransaksiListStore } from "@/lib/store/transaksi/transaksi-store";
import { Transaksi, StatusTransaksi } from "@/lib/types/transaksi";
import { cn } from "@/lib/utils";
import { LoadingIndicator } from "../ui/loading-indicator";

interface TransaksiPerDay {
  [date: string]: Transaksi[];
}

interface CalendarEvent {
  id: string;
  namaPenyewa: string;
  status: StatusTransaksi;
  time: string;
  type: "clothes" | "recipes" | "rental";
}

export default function TransaksiCalendar() {
  const { transaksi, fetchTransaksi } = useTransaksiListStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<TransaksiPerDay>({});
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mendapatkan tanggal awal dan akhir bulan
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);
        
        // Format tanggal untuk filter
        const startDateStr = format(startDate, "yyyy-MM-dd");
        const endDateStr = format(endDate, "yyyy-MM-dd");
        
        // Mengambil data transaksi untuk rentang bulan ini
        await fetchTransaksi(1, {
          startDate: startDateStr,
          endDate: endDateStr,
          limit: 100, // Ambil lebih banyak data untuk kalender
        });
      } catch (error) {
        console.error("Gagal memuat data kalender:", error);
      } finally {
        setIsCalendarLoading(false);
      }
    };
    
    fetchData();
  }, [currentDate, fetchTransaksi]);
  
  // Mengorganisir transaksi berdasarkan tanggal
  useEffect(() => {
    if (transaksi.length > 0) {
      const transaksiByDate: TransaksiPerDay = {};
      
      transaksi.forEach((t) => {
        // Format tanggal dari transaksi
        const startDate = t.tanggalMulai.split("T")[0];
        const endDate = t.tanggalSelesai.split("T")[0];
        
        // Tambahkan transaksi ke tanggal mulai
        if (!transaksiByDate[startDate]) {
          transaksiByDate[startDate] = [];
        }
        transaksiByDate[startDate].push(t);
        
        // Tambahkan juga ke tanggal selesai jika berbeda
        if (startDate !== endDate) {
          if (!transaksiByDate[endDate]) {
            transaksiByDate[endDate] = [];
          }
          transaksiByDate[endDate].push(t);
        }
      });
      
      setCalendarData(transaksiByDate);
    }
  }, [transaksi]);
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const resetToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Mendapatkan hari-hari untuk bulan saat ini
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Mendapatkan semua hari dalam sebulan
  const daysInMonth = () => {
    const daysList = days.map((day) => {
      const formattedDate = format(day, "yyyy-MM-dd");
      const eventsForDay = calendarData[formattedDate] || [];
      
      return (
        <div
          key={day.toString()}
          className={cn(
            "border min-h-[120px] p-2 relative",
            !isSameMonth(day, monthStart) && "bg-gray-100",
            isSameDay(day, new Date()) && "bg-gray-50"
          )}
        >
          <div className="text-sm font-medium mb-1">{format(day, dateFormat)}</div>
          <div className="space-y-1">
            {eventsForDay.map((event, idx) => (
              <CalendarEvent key={`${event.id}-${idx}`} event={event} />
            ))}
          </div>
        </div>
      );
    });

    // Mengisi array dengan sel kosong untuk posisi hari yang benar
    const firstDayOfMonth = getDay(monthStart);
    const blanks = Array(firstDayOfMonth).fill(null).map((_, idx) => (
      <div key={`blank-${idx}`} className="border min-h-[120px] bg-gray-50" />
    ));

    return [...blanks, ...daysList];
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={resetToToday} variant="outline" size="sm">
            Hari Ini
          </Button>
          
          <div className="flex items-center border rounded-md">
            <Button onClick={prevMonth} variant="ghost" size="icon" className="p-0 h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={nextMonth} variant="ghost" size="icon" className="p-0 h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <Button variant="outline" size="sm" className="ml-2" onClick={() => {}}>
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="text-center font-medium py-2 border-b">
            {day}
          </div>
        ))}
        {isCalendarLoading ? (
          <div className="col-span-7 h-40 flex justify-center items-center">
            <LoadingIndicator />
          </div>
        ) : (
          daysInMonth()
        )}
      </div>
    </div>
  );
}

interface CalendarEventProps {
  event: Transaksi;
}

function CalendarEvent({ event }: CalendarEventProps) {
  const getEventTypeColor = (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case StatusTransaksi.BERJALAN:
      case StatusTransaksi.AKTIF:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case StatusTransaksi.SELESAI:
        return "bg-green-100 text-green-800 border-green-200";
      case StatusTransaksi.BATAL:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case StatusTransaksi.OVERDUE:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEventTime = (event: Transaksi) => {
    return event.jamMulai ? event.jamMulai : "4:15p";
  };

  return (
    <div
      className={cn(
        "text-xs p-1 rounded border flex flex-col",
        getEventTypeColor(event.status)
      )}
    >
      <div className="font-medium">{getEventTime(event)}</div>
      <div>{event.namaPenyewa}</div>
      <div>Rental motor</div>
    </div>
  );
}

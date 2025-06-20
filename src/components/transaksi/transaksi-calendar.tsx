'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Bike,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Filter,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah, formatTanggal } from '@/lib/helper';
import { useTransaksiListStore } from '@/lib/store/transaksi/transaksi-store';
import { StatusTransaksi, Transaksi } from '@/lib/types/transaksi';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { LoadingIndicator } from '../ui/loading-indicator';
import { StatusBadge } from '../ui/status-badge';

interface TransaksiWithState extends Transaksi {
  isStart?: boolean;
  isEnd?: boolean;
  isMiddle?: boolean;
}

interface TransaksiPerDay {
  [date: string]: TransaksiWithState[];
}

export default function TransaksiCalendar() {
  const router = useRouter();
  const { transaksi, fetchTransaksi } = useTransaksiListStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<TransaksiPerDay>({});
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusTransaksi | ''>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsCalendarLoading(true);

        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        const startDateStr = format(startDate, 'yyyy-MM-dd');
        const endDateStr = format(endDate, 'yyyy-MM-dd');

        await fetchTransaksi(1, {
          startDate: startDateStr,
          endDate: endDateStr,
          limit: 100,
          status: statusFilter || undefined,
        });
      } catch (error) {
        console.error('Gagal memuat data kalender:', error);
      } finally {
        setIsCalendarLoading(false);
      }
    };

    fetchData();
  }, [currentDate, fetchTransaksi, statusFilter]);

  useEffect(() => {
    if (transaksi.length > 0) {
      const transaksiByDate: TransaksiPerDay = {};

      transaksi.forEach(t => {
        const startDate = t.tanggalMulai.split('T')[0];
        const endDate = t.tanggalSelesai.split('T')[0];

        if (!transaksiByDate[startDate]) {
          transaksiByDate[startDate] = [];
        }
        transaksiByDate[startDate].push({ ...t, isStart: true });

        if (startDate !== endDate) {
          if (!transaksiByDate[endDate]) {
            transaksiByDate[endDate] = [];
          }
          transaksiByDate[endDate].push({ ...t, isEnd: true });
        }

        try {
          const start = parseISO(startDate);
          const end = parseISO(endDate);
          const days = differenceInDays(end, start);

          if (days > 1) {
            for (let i = 1; i < days; i++) {
              const date = new Date(start);
              date.setDate(date.getDate() + i);
              const dateStr = format(date, 'yyyy-MM-dd');

              if (!transaksiByDate[dateStr]) {
                transaksiByDate[dateStr] = [];
              }
              transaksiByDate[dateStr].push({ ...t, isMiddle: true });
            }
          }
        } catch (err) {
          console.error('Gagal mengolah tanggal:', err);
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

  const clearFilters = () => {
    setStatusFilter('');
  };

  const handleFilterChange = (status: StatusTransaksi | '') => {
    setStatusFilter(status);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = 'd';
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const daysInMonth = () => {
    const daysList = days.map(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const eventsForDay = calendarData[formattedDate] || [];
      const isToday = isSameDay(day, new Date());

      return (
        <div
          key={day.toString()}
          className={cn(
            'h-32 border border-neutral-200 p-1 transition-colors dark:border-neutral-800',
            !isSameMonth(day, monthStart) &&
              'bg-neutral-50 dark:bg-neutral-900/50',
            isToday &&
              'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10'
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-sm',
                isToday && 'bg-blue-500 font-medium text-white'
              )}
            >
              {format(day, dateFormat)}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {eventsForDay.length > 0 && `${eventsForDay.length} acara`}
            </div>
          </div>
          <div className="scrollbar-thin max-h-[calc(100%-1.5rem)] space-y-1 overflow-y-auto">
            {eventsForDay.map((event, idx) => (
              <CalendarEvent
                key={`${event.id}-${idx}`}
                event={event}
                onEventClick={() =>
                  router.push(`/dashboard/transaksi/${event.id}`)
                }
                isCompact={eventsForDay.length > 2}
              />
            ))}
          </div>
        </div>
      );
    });

    const firstDayOfMonth = getDay(monthStart);
    const blanks = Array(firstDayOfMonth)
      .fill(null)
      .map((_, idx) => (
        <div
          key={`blank-${idx}`}
          className="h-32 border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/20"
        />
      ));

    return [...blanks, ...daysList];
  };

  const filterOptions = [
    { value: '', label: 'Semua' },
    { value: StatusTransaksi.BOOKING, label: 'Booking' },
    { value: StatusTransaksi.BERJALAN, label: 'Berjalan' },
    { value: StatusTransaksi.AKTIF, label: 'Aktif' },
    { value: StatusTransaksi.SELESAI, label: 'Selesai' },
    { value: StatusTransaksi.BATAL, label: 'Batal' },
    { value: StatusTransaksi.OVERDUE, label: 'Terlambat' },
  ];

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="px-4 py-3 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            <h2 className="text-xl font-semibold dark:text-white">
              {format(currentDate, 'MMMM yyyy', { locale: id })}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={resetToToday} variant="outline" size="sm">
              Hari Ini
            </Button>

            <div className="flex items-center rounded-md border dark:border-neutral-800">
              <Button
                onClick={prevMonth}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextMonth}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="group relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {statusFilter && (
                  <span className="relative ml-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                  </span>
                )}
              </Button>
              <div className="absolute top-full left-0 z-50 mt-1 hidden min-w-40 rounded-md border bg-white p-2 shadow-lg group-hover:block dark:border-neutral-800 dark:bg-neutral-900">
                <div className="space-y-1">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      className={cn(
                        'flex w-full items-center rounded-md px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800',
                        option.value === statusFilter &&
                          'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      )}
                      onClick={() =>
                        handleFilterChange(option.value as StatusTransaksi | '')
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {statusFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden p-0">
        <div className="grid grid-cols-7 overflow-hidden">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div
              key={day}
              className="border-t border-b bg-neutral-50 py-2 text-center text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300"
            >
              {day}
            </div>
          ))}
          {isCalendarLoading ? (
            <div className="col-span-7 flex h-96 items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            daysInMonth()
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CalendarEventProps {
  event: TransaksiWithState;
  onEventClick: () => void;
  isCompact?: boolean;
}

function CalendarEvent({
  event,
  onEventClick,
  isCompact = false,
}: CalendarEventProps) {
  const getEventTypeColor = (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30';
      case StatusTransaksi.BERJALAN:
      case StatusTransaksi.AKTIF:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30';
      case StatusTransaksi.SELESAI:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30';
      case StatusTransaksi.BATAL:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-700/30';
      case StatusTransaksi.OVERDUE:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-700/30';
    }
  };

  const getEventTime = (event: Transaksi) => {
    return event.jamMulai ? event.jamMulai : '00:00';
  };

  const getEventLabel = () => {
    if (event.isStart) return 'Mulai';
    if (event.isEnd) return 'Selesai';
    if (event.isMiddle) return 'Berlangsung';
    return '';
  };

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          onClick={onEventClick}
          className={cn(
            'flex cursor-pointer flex-col rounded border transition-all hover:shadow-md',
            getEventTypeColor(event.status),
            isCompact ? 'px-1 py-0.5 text-[10px]' : 'p-1 text-xs'
          )}
        >
          <div className="flex items-center gap-1 font-medium">
            {getEventTime(event)}
            {!isCompact && getEventLabel() && (
              <span className="rounded bg-white/50 px-1 py-0.5 text-[9px] dark:bg-black/20">
                {getEventLabel()}
              </span>
            )}
          </div>
          <div className="truncate">{event.namaPenyewa}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 overflow-hidden p-0" align="start">
        <div
          className={cn(
            'p-2 text-sm font-medium',
            event.status === StatusTransaksi.BOOKING
              ? 'bg-yellow-50 dark:bg-yellow-950'
              : event.status === StatusTransaksi.BERJALAN ||
                  event.status === StatusTransaksi.AKTIF
                ? 'bg-blue-50 dark:bg-blue-950'
                : event.status === StatusTransaksi.SELESAI
                  ? 'bg-green-50 dark:bg-green-950'
                  : event.status === StatusTransaksi.BATAL
                    ? 'bg-neutral-50 dark:bg-neutral-900'
                    : event.status === StatusTransaksi.OVERDUE
                      ? 'bg-red-50 dark:bg-red-950'
                      : 'bg-neutral-50 dark:bg-neutral-900'
          )}
        >
          Detail Transaksi
        </div>
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">{event.namaPenyewa}</span>
            <StatusBadge status={event.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Bike className="mt-0.5 h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <div>
                <div className="font-medium">Motor</div>
                <div>
                  {event.unitMotor?.jenis?.merk} {event.unitMotor?.jenis?.model}
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {event.unitMotor?.platNomor}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <div>
                <div className="font-medium">Waktu Sewa</div>
                <div>
                  {formatTanggal(event.tanggalMulai)}, {event.jamMulai}
                </div>
                <div>
                  s/d {formatTanggal(event.tanggalSelesai)}, {event.jamSelesai}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CreditCard className="mt-0.5 h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <div>
                <div className="font-medium">Total Biaya</div>
                <div className="font-medium text-green-600 dark:text-green-400">
                  {formatRupiah(event.totalBiaya)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <div>
                <div className="font-medium">Kontak</div>
                <div>{event.noWhatsapp}</div>
              </div>
            </div>
          </div>

          <Button size="sm" className="mt-3 w-full" onClick={onEventClick}>
            Lihat Detail
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

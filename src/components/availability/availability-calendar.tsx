import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAvailabilityStore } from '@/lib/store/availability/availability-store';
import { useJenisMotorStore } from '@/lib/store/jenis-motor/jenis-motor-store';
import React from 'react';

const JAM_OPTIONS = [
  { value: '08:00', label: '08:00' },
  { value: '09:00', label: '09:00' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '12:00', label: '12:00' },
  { value: '13:00', label: '13:00' },
  { value: '14:00', label: '14:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '17:00', label: '17:00' },
];

export function AvailabilityCalendar() {
  const { 
    loading,
    error,
    units,
    selectedDate,
    selectedJenisId,
    jamMulai,
    jamSelesai,
    setSelectedDate,
    setSelectedJenisId,
    setJamMulai,
    setJamSelesai,
    fetchAvailability 
  } = useAvailabilityStore();

  const { data: jenisMotorList = [] } = useJenisMotorStore();

  React.useEffect(() => {
    fetchAvailability(selectedDate);
  }, [selectedDate, selectedJenisId, jamMulai, jamSelesai, fetchAvailability]);

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <div className="space-y-6">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jenisMotor">Jenis Motor</Label>
              <Select
                value={selectedJenisId || ''}
                onValueChange={(value) => setSelectedJenisId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua jenis motor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua jenis motor</SelectItem>
                  {jenisMotorList.map((jenis) => (
                    <SelectItem key={jenis.id} value={jenis.id}>
                      {jenis.merk} {jenis.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jamMulai">Jam Mulai</Label>
              <Select
                value={jamMulai || 'default'}
                onValueChange={(value) => setJamMulai(value === 'default' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jam mulai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Pilih jam mulai</SelectItem>
                  {JAM_OPTIONS.map((jam) => (
                    <SelectItem key={jam.value} value={jam.value}>
                      {jam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jamSelesai">Jam Selesai</Label>
              <Select
                value={jamSelesai || 'default'}
                onValueChange={(value) => setJamSelesai(value === 'default' ? null : value)}
                disabled={!jamMulai}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jam selesai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Pilih jam selesai</SelectItem>
                  {JAM_OPTIONS.filter(jam => {
                    // Hanya tampilkan jam yang lebih besar dari jam mulai
                    if (!jamMulai) return true;
                    return jam.value > jamMulai;
                  }).map((jam) => (
                    <SelectItem key={jam.value} value={jam.value}>
                      {jam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          {error ? (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          ) : loading ? (
            <LoadingIndicator message="Memuat data availability..." />
          ) : (
            <div className="space-y-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{unit.platNomor}</p>
                    <p className="text-sm text-gray-500">
                      {unit.jenis?.merk} {unit.jenis?.model}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    unit.status === 'TERSEDIA'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {unit.status === 'TERSEDIA' ? 'Tersedia' : 'Tidak Tersedia'}
                  </div>
                </div>
              ))}

              {units.length === 0 && (
                <p className="text-center text-gray-500">
                  Tidak ada unit motor yang tersedia
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

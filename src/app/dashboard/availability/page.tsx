'use client';

import { AvailabilityCalendar } from '@/components/availability/availability-calendar';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AvailabilityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 overflow-hidden pb-16 md:space-y-8 md:pb-20">
        <PageHeader
          title="Availability Calendar"
          description="Lihat ketersediaan semua unit motor dalam calendar view"
        />

        <div className="flex gap-4 mb-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter jenis motor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              {/* Jenis motor options akan di-populate dari API */}
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Unit</SelectItem>
              {/* Unit motor options akan di-populate dari API */}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="pt-6">
            <AvailabilityCalendar />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
import React from 'react';
import { Calendar, LayoutGrid, Table } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type ViewMode = 'table' | 'card' | 'calendar';

interface TableViewSelectorProps {
  viewMode: ViewMode;
  onChange: (value: ViewMode) => void;
  showCardOption?: boolean;
  showCalendarOption?: boolean;
  className?: string;
}

export function TableViewSelector({
  viewMode,
  onChange,
  showCardOption = true,
  showCalendarOption = true,
  className = '',
}: TableViewSelectorProps) {
  return (
    <Tabs
      value={viewMode}
      onValueChange={value => onChange(value as ViewMode)}
      className={className}
    >
      <TabsList>
        <TabsTrigger value="table">
          <Table className="mr-2 h-4 w-4" />
          Tabel
        </TabsTrigger>

        {showCardOption && (
          <TabsTrigger value="card">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Card
          </TabsTrigger>
        )}

        {showCalendarOption && (
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Kalender
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}

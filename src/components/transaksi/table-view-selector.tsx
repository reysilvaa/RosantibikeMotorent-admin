import React from "react";
import { Table, Calendar, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ViewMode = "table" | "card" | "calendar";

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
  className = "",
}: TableViewSelectorProps) {
  return (
    <Tabs
      value={viewMode}
      onValueChange={(value) => onChange(value as ViewMode)}
      className={className}
    >
      <TabsList>
        <TabsTrigger value="table">
          <Table className="h-4 w-4 mr-2" />
          Tabel
        </TabsTrigger>
        
        {showCardOption && (
          <TabsTrigger value="card">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Card
          </TabsTrigger>
        )}
        
        {showCalendarOption && (
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Kalender
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
} 
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  currentValue?: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [tabValue, setTabValue] = React.useState(defaultValue || '');

  const contextValue = React.useMemo(
    () => ({
      value: value !== undefined ? value : tabValue,
      onValueChange: (newValue: string) => {
        onValueChange?.(newValue);
        if (value === undefined) {
          setTabValue(newValue);
        }
      },
    }),
    [value, tabValue, onValueChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn('flex space-x-1 rounded-lg bg-neutral-100 p-1', className)}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  active,
  children,
  onClick,
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = active !== undefined ? active : selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-offset-white transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-neutral-900 shadow-sm'
          : 'text-neutral-500 hover:text-neutral-900',
        className
      )}
      onClick={() => {
        onValueChange(value);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  currentValue,
  className,
  children,
}: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext);
  const isSelected =
    currentValue !== undefined
      ? currentValue === value
      : selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={cn('mt-2', className)}
    >
      {children}
    </div>
  );
}

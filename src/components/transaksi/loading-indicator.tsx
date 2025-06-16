import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Memuat data...</span>
    </div>
  );
}
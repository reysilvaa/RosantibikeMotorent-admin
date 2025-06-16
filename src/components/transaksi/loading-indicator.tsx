export function LoadingIndicator() {
  return (
    <div className="grid h-96 place-items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-lg font-medium">Memuat data...</p>
      </div>
    </div>
  );
} 
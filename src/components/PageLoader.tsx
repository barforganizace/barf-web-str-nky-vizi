export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
        <span className="text-sm text-gray-400">Načítání…</span>
      </div>
    </div>
  );
}

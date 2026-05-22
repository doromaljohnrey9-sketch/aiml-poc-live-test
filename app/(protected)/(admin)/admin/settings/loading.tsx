export default function AdminSettingsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

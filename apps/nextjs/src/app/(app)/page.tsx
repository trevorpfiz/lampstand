export default function Home() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="flex-1 rounded-xl bg-muted/50">
        <div className="grid gap-4 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

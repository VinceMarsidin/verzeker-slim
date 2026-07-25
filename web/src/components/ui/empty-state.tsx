export function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
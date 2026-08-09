import { Card } from '@/components/ui/card'

export function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <Card className="p-5">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-2xl font-bold text-ink">{value}</p>
    </Card>
  )
}

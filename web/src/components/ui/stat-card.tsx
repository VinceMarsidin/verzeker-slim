type Accent = 'blue' | 'orange' | 'emerald'

const accents: Record<Accent, string> = {
  blue: 'from-blue-600 to-blue-400',
  orange: 'from-orange-500 to-orange-400',
  emerald: 'from-emerald-500 to-emerald-400',
}

export function StatCard({
  label,
  value,
  accent = 'blue',
}: {
  label: string
  value: string | number
  accent?: Accent
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className={`absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br ${accents[accent]} opacity-10`}
      />
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold text-slate-900 tabular-nums">
        {value}
      </p>
    </div>
  )
}

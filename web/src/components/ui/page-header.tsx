import { Plus } from 'lucide-react'

export function PageHeader({
  title,
  description,
  onAdd,
  addLabel,
}: {
  title: string
  description: string
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{description}</p>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-orange-500 text-white pl-3 pr-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          {addLabel}
        </button>
      )}
    </div>
  )
}

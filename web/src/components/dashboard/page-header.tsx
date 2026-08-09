import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="font-slab text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="bg-stamp-dark hover:bg-stamp-dark/90">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}

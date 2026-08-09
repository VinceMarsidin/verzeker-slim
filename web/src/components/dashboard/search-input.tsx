import { Search, X } from 'lucide-react'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Zoeken...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative max-w-sm flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-8 text-sm outline-none focus:border-[#1f6fb2] focus:ring-2 focus:ring-[#1f6fb2]/20"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
          aria-label="Zoekopdracht wissen"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

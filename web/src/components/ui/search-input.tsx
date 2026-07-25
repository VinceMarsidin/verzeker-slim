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
    <div className="relative flex-1 max-w-sm">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-full text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors bg-white"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label="Zoekopdracht wissen"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

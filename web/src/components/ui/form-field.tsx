import type { ReactNode } from 'react'

export function FormField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// Herbruikbare input-stijl, importeer deze in elk formulier voor consistentie
export const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm bg-slate-50 focus:bg-white'

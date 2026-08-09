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
      <label className="mb-2 block text-sm font-semibold text-ink">{label}</label>
      {children}
    </div>
  )
}

// Zelfde stijl als de <Select> component van Vince, zodat inputs en
// dropdowns er in formulieren identiek uitzien.
export const inputClass =
  'h-11 w-full rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink outline-none focus:border-[#1f6fb2] focus:ring-2 focus:ring-[#1f6fb2]/20'

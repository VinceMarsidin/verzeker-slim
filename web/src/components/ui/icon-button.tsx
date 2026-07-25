import type { ReactNode } from 'react'

export function IconButton({
  onClick,
  variant,
  children,
}: {
  onClick: () => void
  variant: 'default' | 'danger'
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center transition-colors ${
        variant === 'danger'
          ? 'text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
          : 'text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  )
}

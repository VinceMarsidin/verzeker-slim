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
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-line transition-colors ${
        variant === 'danger'
          ? 'text-ink-soft hover:border-red-200 hover:bg-red-50 hover:text-red-600'
          : 'text-ink-soft hover:border-[#c77f2b]/30 hover:bg-[#fdf1e2] hover:text-stamp-dark'
      }`}
    >
      {children}
    </button>
  )
}

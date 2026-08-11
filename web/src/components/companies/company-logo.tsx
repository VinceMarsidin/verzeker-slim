import { cn } from '@/lib/utils'

interface CompanyLogoProps {
  name: string
  logoInitial: string
  logoUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-lg',
  lg: 'h-16 w-16 text-2xl',
} as const

/**
 * Toont het echte logobestand van een maatschappij zodra dat is geüpload
 * (company.logoUrl), anders valt hij netjes terug op de letter-badge.
 */
export function CompanyLogo({ name, logoInitial, logoUrl, size = 'md', className }: CompanyLogoProps) {
  if (logoUrl) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-line bg-white p-1.5',
          sizeClasses[size],
          className,
        )}
      >
        <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-contain" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-[6px] border border-line bg-slate-tint font-mono font-bold text-slate',
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {logoInitial}
    </div>
  )
}

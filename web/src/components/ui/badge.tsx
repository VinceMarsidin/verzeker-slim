import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-slate-tint text-slate',
        success: 'bg-trust-tint text-trust',
        warning: 'bg-stamp-tint text-stamp-dark',
        outline: 'border border-line text-ink-soft',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

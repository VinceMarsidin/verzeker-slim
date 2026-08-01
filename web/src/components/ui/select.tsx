import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

// Lightweight native <select>, styled to match shadcn's look.
// Swap for @radix-ui/react-select later if you need custom option rendering.
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-11 w-full appearance-none rounded-lg border border-[#dbe4ef] bg-white px-4 pr-10 text-sm font-medium text-[#0d3b66] outline-none focus:border-[#1f6fb2] focus:ring-2 focus:ring-[#1f6fb2]/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7f92]" />
    </div>
  ),
)
Select.displayName = 'Select'

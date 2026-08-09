import { ShieldCheck } from 'lucide-react'

interface LogoAnimatedProps {
  size?: number
  className?: string
}

export function LogoAnimated({ size = 64, className = '' }: LogoAnimatedProps) {
  return (
    <div
      className={`logo-stamp-wrap ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="logo-stamp-ring" style={{ width: size, height: size }}>
        <ShieldCheck
          className="text-stamp-dark"
          style={{ width: size * 0.52, height: size * 0.52 }}
        />
      </div>
    </div>
  )
}

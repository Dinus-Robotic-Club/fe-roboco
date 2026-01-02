import { getStatusStyle } from '@/lib/function'
import { IStatusBadgeProps } from '@/lib/types'

export function StatusBadge({ children, className = '', label }: IStatusBadgeProps) {
  if (!children) return null

  const variantClass = getStatusStyle(children)
  const displayText = label || children

  return (
    <span
      className={`
        inline-flex items-center justify-center 
        px-2.5 py-0.5 
        text-[10px] lg:text-xs font-bold uppercase tracking-wide
        rounded-full border 
        whitespace-nowrap transition-colors
        ${variantClass} 
        ${className}
      `}>
      {displayText}
    </span>
  )
}

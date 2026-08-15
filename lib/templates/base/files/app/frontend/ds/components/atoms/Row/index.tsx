import { cn } from '../../../utils/cn'

interface RowProps {
  children: React.ReactNode
  noGutters?: boolean
  className?: string
}

export function Row({ children, noGutters = false, className }: RowProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap',
        !noGutters && '-mx-2',
        className
      )}
    >
      {children}
    </div>
  )
}

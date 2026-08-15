import { cn } from '../../../utils/cn'

interface ContainerProps {
  children: React.ReactNode
  fluid?: boolean
  className?: string
}

export function Container({ children, fluid = false, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full px-4 mx-auto',
        !fluid && 'max-w-[1140px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]',
        className
      )}
    >
      {children}
    </div>
  )
}

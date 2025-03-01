import { cn } from '@/utils/ui'
import { PropsWithChildren } from 'react'

type ContainerProps = PropsWithChildren & {
  compact?: boolean
  className?: string
}

export default function Container({ children, className, compact }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {!compact ? children : <div className="mx-auto max-w-3xl">{children}</div>}
    </div>
  )
}

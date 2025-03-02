import { cn } from '@/utils/ui'
import { PropsWithChildren, ReactNode } from 'react'

type ContainerProps = PropsWithChildren & {
  compact?: boolean
  className?: string
  header?: ReactNode
}

export default function Container({ children, className, compact, header }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 sm:py-6 md:py-8 lg:px-8', className)}>
      {!compact ? (
        <>
          {header && (
            <div className="pb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">{header}</div>
            </div>
          )}
          {children}
        </>
      ) : (
        <div className="mx-auto max-w-3xl">
          <>
            {header && (
              <div className="pb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">{header}</div>
              </div>
            )}
            {children}
          </>
        </div>
      )}
    </div>
  )
}

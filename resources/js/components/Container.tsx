import { clsx } from 'clsx'
import { PropsWithChildren } from 'react'

export default function Container({ children, className }: PropsWithChildren & { className?: string }) {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

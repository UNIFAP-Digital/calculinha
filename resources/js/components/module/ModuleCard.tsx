import { ModuleActions } from '@/components/module/ModuleActions'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { Separator } from '@/components/ui/separator'
import { ReactNode, useState } from 'react'
import { Module } from '@/models'

export interface ModuleCardProps {
  module: Module
  order?: number
  isFirst?: boolean
  isLast?: boolean
  onClick?: () => void
  onEdit?: (module: Module) => void
  onDelete?: (module: Module) => void
  onMove?: (module: Module, direction: 'up' | 'down') => void
  children: ReactNode
}

export default function ModuleCard({ module, order, isFirst, isLast, onClick, onEdit, onDelete, onMove, children }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg border cursor-pointer" onClick={onClick}>
        <div className="flex items-center justify-between">
          <ModuleHeader module={module} order={order} onClick={() => setIsExpanded(!isExpanded)} />

          <div className="px-4">
            <ModuleActions
              module={module}
              isFirst={isFirst}
              isLast={isLast}
              isExpanded={isExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            {children}
          </>
        )}
      </div>
    </>
  )
}

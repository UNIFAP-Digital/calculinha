import { ModuleActions } from '@/components/module/ModuleActions'
import { ModuleHeader } from '@/components/module/ModuleHeader'
import { Separator } from '@/components/ui/separator'
import Module from '@/models/module'
import { ReactNode, useState } from 'react'

export interface ModuleCardProps {
  module: Module
  order?: number
  isFirst?: boolean
  isLast?: boolean
  onEdit?: (module: Module) => void
  onDelete?: (module: Module) => void
  onMove?: (module: Module, direction: 'up' | 'down') => void
  children: ReactNode
}

export default function ModuleCard({ module, order, isFirst, isLast, onEdit, onDelete, onMove, children }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg border" style={{ borderColor: module.color }}>
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

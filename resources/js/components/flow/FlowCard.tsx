import { FlowActions } from '@/components/flow/FlowActions'
import { FlowHeader } from '@/components/flow/FlowHeader'
import { Separator } from '@/components/ui/separator'
import Flow from '@/models/flow'
import { ReactNode, useState } from 'react'

export interface FlowCardProps {
  flow: Flow
  order?: number
  isFirst?: boolean
  isLast?: boolean
  onEdit?: (flow: Flow) => void
  onUnlink?: (flow: Flow) => void
  onDelete?: (flow: Flow) => void
  onMove?: (flow: Flow, direction: 'up' | 'down') => void
  children: ReactNode
}

export default function FlowCard({ flow, order, isFirst, isLast, onUnlink, onEdit, onDelete, onMove, children }: FlowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg border" style={{ borderColor: flow.color }}>
        <div className="flex items-center justify-between">
          <FlowHeader flow={flow} order={order} onClick={() => setIsExpanded(!isExpanded)} />

          <div className="px-4">
            <FlowActions
              flow={flow}
              isFirst={isFirst}
              isLast={isLast}
              onUnlink={onUnlink}
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

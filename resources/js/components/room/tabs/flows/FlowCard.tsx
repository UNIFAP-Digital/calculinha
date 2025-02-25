import ActivityList from '@/components/room/tabs/flows/activity/ActivityList'
import { Separator } from '@/components/ui/separator'
import { Flow } from '@/models/flow'
import { useState } from 'react'
import { FlowActions } from './FlowActions'
import { FlowHeader } from './FlowHeader'

export interface FlowCardProps {
  flow: Flow
  order: number
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export default function FlowCard({ flow, order, isFirst, isLast, onDelete, onMoveDown, onMoveUp, onEdit }: FlowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="rounded-lg border bg-card" style={{ borderColor: flow.color }}>
        <div className="flex items-center justify-between">
          <FlowHeader flow={flow} order={order} onClick={() => setIsExpanded(!isExpanded)} />

          <div className="px-4">
            <FlowActions
              flowName={flow.name}
              isFirst={isFirst}
              isLast={isLast}
              isExpanded={isExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            <ActivityList flow={flow} flowActivities={flow.flow_activities ?? []} />
          </>
        )}
      </div>
    </>
  )
}

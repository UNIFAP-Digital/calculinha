import FlowActions from '@/components/flow/FlowActions'
import FlowHeader from '@/components/flow/FlowHeader'
import FlowActivityList from '@/components/flow-activity/FlowActivityList'
import { Separator } from '@/components/ui/separator'
import Flow from '@/models/flow'
import { useState } from 'react'

export interface FlowCardProps {
  flow: Flow
  onDelete: (flow: Flow) => void
  onEdit: (flow: Flow) => void
}

export default function FlowCard({ flow, onDelete, onEdit }: FlowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg border" style={{ borderColor: flow.color }}>
        <div className="flex items-center justify-between">
          <FlowHeader flow={flow} onClick={() => setIsExpanded(!isExpanded)} />

          <div className="px-4">
            <FlowActions
              flowName={flow.name}
              isExpanded={isExpanded}
              onEdit={() => onEdit(flow)}
              onDelete={() => onDelete(flow)}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            <FlowActivityList flow={flow} flowActivities={flow.flow_activities ?? []} />
          </>
        )}
      </div>
    </>
  )
}

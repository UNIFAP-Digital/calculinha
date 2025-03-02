import FlowActivityItem from '@/components/flow/activity/FlowActivityItem'
import { Activity } from '@/models/activity'
import Flow from '@/models/flow'

interface ActivityListProps {
  flow: Flow
  onMove?: (flow: Flow, activity: Activity, direction: 'up' | 'down') => void
}

export default function FlowActivityList({ flow, onMove }: ActivityListProps) {
  return (
    <>
      {(flow.activities ?? []).map((activity, index) => (
        <FlowActivityItem
          key={activity.id}
          isFirst={index === 0}
          isLast={index === flow.activities!.length - 1}
          activity={activity}
          onMove={onMove ? (_, direction) => onMove(flow, activity, direction) : undefined}
        />
      ))}
    </>
  )
}

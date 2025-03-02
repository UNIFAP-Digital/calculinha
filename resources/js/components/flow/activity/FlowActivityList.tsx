import SelectActivityDialog from '@/components/activity/SelectActivityDialog'
import FlowActivityItem from '@/components/flow/activity/FlowActivityItem'
import { Activity } from '@/models/activity'
import Flow from '@/models/flow'

interface ActivityListProps {
  flow: Flow
  onLink?: (flow: Flow, activities: Activity[]) => void
  onUnlink?: (flow: Flow, activity: Activity) => void
  onMove?: (flow: Flow, activity: Activity, direction: 'up' | 'down') => void
}

export default function FlowActivityList({ flow, onLink, onMove, onUnlink }: ActivityListProps) {
  return (
    <>
      {(flow.activities ?? []).map((activity, index) => (
        <FlowActivityItem
          key={activity.id}
          isFirst={index === 0}
          isLast={index === flow.activities!.length - 1}
          activity={activity}
          onUnlink={onUnlink ? () => onUnlink(flow, activity) : undefined}
          onMove={onMove ? (_, direction) => onMove(flow, activity, direction) : undefined}
        />
      ))}

        { !onLink && (flow.activities ?? []).length === 0 && (
            <div className="p-8 flex justify-center text-muted-foreground">
                <p>Nenhuma atividade foi vinculada a está trilha.</p>
            </div>
        ) }

      {onLink && (
        <div className="flex justify-center px-4 py-2">
          <SelectActivityDialog flow={flow} onSelect={onLink} />
        </div>
      )}
    </>
  )
}

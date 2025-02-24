import ActivityActions from '@/components/room/flow/activity/ActivityActions'
import { Badge } from '@/components/ui/badge'
import { FlowActivity } from '@/models/flow-activity'
import { useMemo } from 'react'

interface ActivityItemProps {
  flowActivity: FlowActivity
  isFirst: boolean
  isLast: boolean
  onUnlink: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export default function ActivityItem({ flowActivity, isFirst, isLast, onUnlink, onMoveUp, onMoveDown }: ActivityItemProps) {
  const activity = useMemo(() => flowActivity.activity!, [flowActivity])

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{activity.type === 'multiple_choice' ? 'Múltipla Escolha' : activity.type}</Badge>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{activity.question}</p>
      </div>

      <ActivityActions activity={activity} isFirst={isFirst} isLast={isLast} onUnlink={onUnlink} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
    </div>
  )
}

import FlowActivityActions from '@/components/flow/activity/FlowActivityActions'
import { Badge } from '@/components/ui/badge'
import { Activity } from '@/models/activity'

interface FlowActivityItemProps {
  activity: Activity
  isFirst?: boolean
  isLast?: boolean
  onUnlink?: (activity: Activity) => void
  onMove?: (activity: Activity, direction: 'up' | 'down') => void
}

export default function FlowActivityItem({ activity, isFirst, isLast, onUnlink, onMove }: FlowActivityItemProps) {
  return (
    <div className="border-border flex items-center justify-between border-b px-4 py-2">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{activity.type === 'multiple_choice' ? 'Múltipla Escolha' : activity.type}</Badge>
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">{activity.question}</p>
      </div>

      <FlowActivityActions activity={activity} isFirst={isFirst} isLast={isLast} onUnlink={onUnlink} onMove={onMove} />
    </div>
  )
}

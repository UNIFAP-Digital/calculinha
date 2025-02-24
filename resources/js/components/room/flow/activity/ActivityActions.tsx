import ActivityDetailsDialog from '@/components/activity/ActivityDetailsDialog'
import ActivityUnlinkAlertDialog from '@/components/room/flow/activity/ActivityUnlinkAlertDialog'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import { MoveDown, MoveUp } from 'lucide-react'

interface ActivityActionsProps {
  activity: Activity
  isFirst: boolean
  isLast: boolean
  onUnlink: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export default function ActivityActions({ activity, isFirst, isLast, onUnlink, onMoveUp, onMoveDown }: ActivityActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border-r pr-2">
        <ActivityDetailsDialog activity={activity} className="px-2 py-0" size="sm" />
        <ActivityUnlinkAlertDialog activity={activity} onUnlink={onUnlink} />
      </div>

      <div className="flex flex-col">
        <Button variant="ghost" size="sm" disabled={isFirst} onClick={onMoveUp} className="px-2 py-0">
          <MoveUp className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled={isLast} onClick={onMoveDown} className="px-2 py-0">
          <MoveDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

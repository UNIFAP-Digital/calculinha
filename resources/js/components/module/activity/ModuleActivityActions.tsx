import ActivityDetailsDialog from '@/components/activity/ActivityDetailsDialog'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import { MoveDown, MoveUp } from 'lucide-react'

interface ModuleActivityActionsProps {
  activity: Activity
  isFirst?: boolean
  isLast?: boolean
  onMove?: (activity: Activity, direction: 'up' | 'down') => void
}

export default function ModuleActivityActions({ activity, isFirst, isLast, onMove }: ModuleActivityActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <ActivityDetailsDialog activity={activity} className="px-2 py-0" size="sm" />
      </div>

      {onMove && isFirst !== undefined && isLast !== undefined && (
        <div className="flex flex-col border-l ps-2">
          <Button variant="ghost" size="sm" disabled={isFirst} onClick={() => onMove(activity, 'up')} className="px-2 py-0">
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled={isLast} onClick={() => onMove(activity, 'down')} className="px-2 py-0">
            <MoveDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

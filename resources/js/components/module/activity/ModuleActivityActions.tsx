import ActivityDetailsDialog from '@/components/activity/ActivityDetailsDialog'
import { ReorderIcon } from '@/components/ui/reorder-icon'
import { Activity } from '@/models/activity'
import { DragControls } from 'motion/react'

interface ModuleActivityActionsProps {
  activity: Activity
  dragControls: DragControls
}

export default function ModuleActivityActions({ activity, dragControls }: ModuleActivityActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <ActivityDetailsDialog activity={activity} className="px-2 py-0" size="sm" />
      </div>
      <div className="flex items-center border-l ps-2">
        <ReorderIcon dragControls={dragControls} />
      </div>
    </div>
  )
}

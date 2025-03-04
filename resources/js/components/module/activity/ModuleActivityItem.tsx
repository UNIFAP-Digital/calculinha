import ModuleActivityActions from '@/components/module/activity/ModuleActivityActions'
import { Badge } from '@/components/ui/badge'
import { useRaisedShadow } from '@/hooks/use-raised-shadow'
import { Activity } from '@/models/activity'
import { Reorder, useDragControls, useMotionValue } from 'motion/react'

interface ModuleActivityItemProps {
  activity: Activity
}

export default function ModuleActivityItem({ activity }: ModuleActivityItemProps) {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      value={activity}
      className="border-border flex items-center justify-between border-b bg-white px-4 py-2 select-none"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{'Múltipla Escolha'}</Badge>
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">{activity.question}</p>
      </div>

      <ModuleActivityActions activity={activity} dragControls={dragControls} />
    </Reorder.Item>
  )
}

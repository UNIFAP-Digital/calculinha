import ModuleActivityItem from '@/components/module/activity/ModuleActivityItem'
import { Activity } from '@/models/activity'
import Module from '@/models/module'

interface ActivityListProps {
  module: Module
  onMove?: (module: Module, activity: Activity, direction: 'up' | 'down') => void
}

export default function ModuleActivityList({ module, onMove }: ActivityListProps) {
  return (
    <>
      {(module.activities ?? []).map((activity, index) => (
        <ModuleActivityItem
          key={activity.id}
          isFirst={index === 0}
          isLast={index === module.activities!.length - 1}
          activity={activity}
          onMove={onMove ? (_, direction) => onMove(module, activity, direction) : undefined}
        />
      ))}
    </>
  )
}

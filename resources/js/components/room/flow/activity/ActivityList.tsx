import ActivityItem from '@/components/room/flow/activity/ActivityItem'
import SelectActivityDialog from '@/components/room/flow/activity/SelectActivityDialog'
import { Activity } from '@/models/activity'
import { Flow } from '@/models/flow'
import { FlowActivity } from '@/models/flow-activity'
import { router } from '@inertiajs/react'

interface ActivityListProps {
  flow: Flow
  flowActivities: FlowActivity[]
}

export default function ActivityList({ flowActivities, flow }: ActivityListProps) {
  const handleUnlink = (flowActivity: FlowActivity) => {
    router.delete(route('flow-activities.destroy', [flow.room_id, flow.id, flowActivity.id]), { preserveScroll: true })
  }

  const handleMoveUp = (flowActivity: FlowActivity) => {
    router.post(route('flow-activities.move-up', [flow.room_id, flow.id, flowActivity.id]), {}, { preserveScroll: true })
  }

  const handleMoveDown = (flowActivity: FlowActivity) => {
    router.post(route('flow-activities.move-down', [flow.room_id, flow.id, flowActivity.id]), {}, { preserveScroll: true })
  }

  const handleLink = (activity: Activity) => {
    router.post(
      route('flow-activities.store', [flow.room_id, flow.id, activity.id]),
      {
        flow_id: flow.id,
        activity_id: activity.id,
      },
      { preserveScroll: true },
    )
  }

  return (
    <div>
      {flowActivities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          isFirst={index === 0}
          isLast={index === flowActivities.length - 1}
          flowActivity={activity}
          onUnlink={() => handleUnlink(activity)}
          onMoveUp={() => handleMoveUp(activity)}
          onMoveDown={() => handleMoveDown(activity)}
        />
      ))}

      <div className="flex justify-center px-4 py-2">
        <SelectActivityDialog flow={flow} onSelectActivity={handleLink} />
      </div>
    </div>
  )
}

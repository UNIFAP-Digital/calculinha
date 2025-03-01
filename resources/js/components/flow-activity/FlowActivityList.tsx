import SelectActivityDialog from '@/components/activity/SelectActivityDialog'
import FlowActivityItem from '@/components/flow-activity/FlowActivityItem'
import { Activity } from '@/models/activity'
import Flow from '@/models/flow'
import { FlowActivity } from '@/models/flow-activity'
import { router } from '@inertiajs/react'

interface ActivityListProps {
  flow: Flow
  flowActivities: FlowActivity[]
}

const preserveAll = {
  preserveScroll: true,
  preserveState: true,
  preserveUrl: true,
}

export default function FlowActivityList({ flowActivities, flow }: ActivityListProps) {
  const handleUnlink = (flowActivity: FlowActivity) => {
    router.delete(route('flow-activities.destroy', [flow.id, flowActivity.id]), preserveAll)
  }

  const handleMoveUp = (flowActivity: FlowActivity) => {
    router.post(route('flow-activities.move-up', [flow.id, flowActivity.id]), {}, preserveAll)
  }

  const handleMoveDown = (flowActivity: FlowActivity) => {
    router.post(route('flow-activities.move-down', [flow.id, flowActivity.id]), {}, preserveAll)
  }

  const handleLink = (activity: Activity) => {
    router.post(route('flow-activities.store', [flow.id]), { activity_id: activity.id }, preserveAll)
  }

  return (
    <>
      {flowActivities.map((flowActivity, index) => (
        <FlowActivityItem
          key={flowActivity.id}
          isFirst={index === 0}
          isLast={index === flowActivities.length - 1}
          activity={flowActivity.activity!}
          onUnlink={() => handleUnlink(flowActivity)}
          onMoveUp={() => handleMoveUp(flowActivity)}
          onMoveDown={() => handleMoveDown(flowActivity)}
        />
      ))}

      <div className="flex justify-center px-4 py-2">
        <SelectActivityDialog flow={flow} onSelect={handleLink} />
      </div>
    </>
  )
}

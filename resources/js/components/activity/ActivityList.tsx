import ActivityCard from '@/components/activity/ActivityCard'
import ActivityFormCard from '@/components/activity/ActivityFormCard'
import { Activity } from '@/models/activity'
import { Fragment, useState } from 'react'

interface ActivityListProps {
  activities: Activity[]
  onDelete: (activity: Activity) => void
}

export default function ActivityList({ activities, onDelete }: ActivityListProps) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Fragment key={activity.id}>
          {editingActivity?.id === activity.id ? (
            <ActivityFormCard activity={activity} onSaved={() => setEditingActivity(null)} onCancel={() => setEditingActivity(null)} />
          ) : (
            <ActivityCard activity={activity} onDelete={() => onDelete(activity)} onEdit={() => setEditingActivity(activity)} />
          )}
        </Fragment>
      ))}
    </div>
  )
}

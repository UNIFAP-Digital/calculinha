import ActivityCard from '@/components/activity/ActivityCard'
import ActivityFormCard from '@/components/activity/ActivityFormCard'
import { Activity } from '@/models/activity'
import { router } from '@inertiajs/react'
import { Fragment, useState } from 'react'

interface ActivityListProps {
  activities: Activity[]
}

export default function ActivityList({ activities }: ActivityListProps) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const handleDelete = (activity: Activity) => {
    router.delete(route('activities.destroy', activity.id))
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Fragment key={activity.id}>
          {editingActivity?.id === activity.id ? (
            <ActivityFormCard activity={activity} onSaved={() => setEditingActivity(null)} onCancel={() => setEditingActivity(null)} />
          ) : (
            <ActivityCard activity={activity} onDelete={() => handleDelete(activity)} onEdit={() => setEditingActivity(activity)} />
          )}
        </Fragment>
      ))}
    </div>
  )
}

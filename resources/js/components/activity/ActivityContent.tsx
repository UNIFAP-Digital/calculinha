import ActivityFormCard from '@/components/activity/ActivityFormCard'
import ActivityList from '@/components/activity/ActivityList'
import { Activity } from '@/models/activity'
import { useMemo } from 'react'

interface ActivityContent {
  activities: Activity[]
  searchTerm: string
  className?: string
  isAdding: boolean
  onAdded: () => void
  onCancelAdding: () => void
}

export default function ActivityContent({ activities, className, searchTerm, onAdded, onCancelAdding, isAdding }: ActivityContent) {
  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.wrong_answers.some((answer) => answer.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [activities, searchTerm])

  return (
    <div className={className}>
      {isAdding && (
        <div className="mb-4">
          <ActivityFormCard onSaved={onAdded} onCancel={onCancelAdding} />
        </div>
      )}

      <ActivityList activities={filteredActivities} />

      {activities.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          {filteredActivities.length === 0 ? 'Nenhuma atividade disponível.' : `Nenhuma atividade encontrada para "${searchTerm}"`}
        </div>
      )}
    </div>
  )
}

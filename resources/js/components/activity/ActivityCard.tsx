import ActivityDetailsDialog from '@/components/activity/ActivityDetailsDialog'
import DestructiveActionAlertDialog from '@/components/DestructiveActionAlertDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Activity } from '@/models/activity'
import { Edit } from 'lucide-react'

interface ActivityCardProps {
  activity: Activity
  onEdit: () => void
  onDelete: () => void
}

export default function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  return (
    <Card>
      <CardContent className="flex justify-between p-4">
        <div>
          <p className="mb-2 text-sm font-medium">{activity.question}</p>
          <p className="text-muted-foreground text-sm">
            <span className="font-medium">Resposta correta:</span> {activity.correct_answer}
          </p>
        </div>

        <div className="flex items-center">
          <Badge variant="secondary" className="mr-4">
            {activity.type === 'multiple_choice' ? 'Múltipla escolha' : activity.type}
          </Badge>
          <Separator orientation="vertical" className="mx-2 h-8" />
          <div className="flex space-x-1">
            <ActivityDetailsDialog activity={activity} size="icon" />
            <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
              <Edit />
            </Button>
            <DestructiveActionAlertDialog
              variant="ghost"
              size="icon"
              description="Esta ação não pode ser desfeita. Isso irá apagar permanentemente a atividade e todos os seus dados."
              onConfirm={onDelete}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Activity } from '@/models/activity'
import { Eye } from 'lucide-react'

interface ActivityDetailsDialogProps {
  activity: Activity
  className?: string
  size: 'sm' | 'icon'
}

export default function ActivityDetailsDialog({ activity, className, size }: ActivityDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={size} className={className}>
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Atividade #{activity.id}</DialogTitle>
          <DialogDescription>Verifique as informações dessa atividade abaixo.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tipo</h4>
            <p className="text-sm text-muted-foreground">{activity.type === 'multiple_choice' ? 'Múltipla Escolha' : activity.type}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Questão</h4>
            <p className="text-sm text-muted-foreground">{activity.question}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resposta Correta</h4>
            <div className="flex">
              <Badge variant="outline" className="text-primary">
                {activity.correct_answer}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Respostas Incorretas</h4>
            <div className="flex flex-wrap gap-2">
              {activity.wrong_answers.map((answer, index) => (
                <Badge key={index} variant="outline" className="text-destructive">
                  {answer}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

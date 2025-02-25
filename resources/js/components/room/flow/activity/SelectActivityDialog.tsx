import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity } from '@/models/activity'
import { Flow } from '@/models/flow'
import { httpGet } from '@/utils/api'
import { Link, Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SelectActivityDialogProps {
  flow: Flow
  onSelectActivity: (activity: Activity) => void
}

export default function SelectActivityDialog({ flow, onSelectActivity }: SelectActivityDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await httpGet<Activity[]>(route('activities.index', { flow_id: flow.id }))
      setActivities(response)
    } catch {
      setError('Erro ao carregar atividades. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) fetchActivities().then()
  }, [isOpen, flow])

  const filteredActivities = activities.filter(
    (activity) =>
      activity.question.toLowerCase().includes(searchTerm.toLowerCase()) || activity.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectActivity = (activity: Activity) => {
    onSelectActivity(activity)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Link />
          Vincular atividade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecionar Atividade</DialogTitle>
          <DialogDescription>Escolha uma atividade de múltipla escolha para vincular ao fluxo</DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por questão ou resposta..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">
              {error}
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchActivities}>
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex cursor-pointer flex-col gap-2 rounded-lg border p-4 hover:bg-accent"
                  onClick={() => handleSelectActivity(activity)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1 text-sm font-medium">{activity.question}</p>
                    <Badge variant="secondary" className="shrink-0">
                      Múltipla Escolha
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Resposta:</span> {activity.correct_answer}
                  </p>
                </div>
              ))}

              {filteredActivities.length === 0 && !isLoading && (
                <div className="py-8 text-center text-muted-foreground">
                  {activities.length === 0 ? 'Nenhuma atividade disponível.' : `Nenhuma questão encontrada para "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

import SearchBar from '@/components/SearchBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity } from '@/models/activity'
import Flow from '@/models/flow'
import { httpGet } from '@/utils/api'
import { Link, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface SelectActivityDialogProps {
  flow: Flow
  onSelect: (flow: Flow, activities: Activity[]) => void
}

export default function SelectActivityDialog({ flow, onSelect }: SelectActivityDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await httpGet<Activity[]>(route('api.activities.index', { flow_id: flow.id }))
      setActivities(response)
    } catch {
      setError('Erro ao carregar atividades. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [flow.id])

  useEffect(() => {
    if (isOpen) {
      fetchActivities().then()
      // Limpa seleções anteriores quando o diálogo é aberto
      setSelectedActivities([])
    }
  }, [isOpen, flow, fetchActivities])

  const filteredActivities = activities.filter(
    (activity) =>
      activity.question.toLowerCase().includes(searchTerm.toLowerCase()) || activity.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleActivity = (activity: Activity) => {
    setSelectedActivities((prev) => {
      const isSelected = prev.some((item) => item.id === activity.id)

      if (isSelected) {
        return prev.filter((item) => item.id !== activity.id)
      } else {
        return [...prev, activity]
      }
    })
  }

  const handleSubmit = () => {
    onSelect(flow, selectedActivities)
    setIsOpen(false)
  }

  const isActivitySelected = (activity: Activity) => {
    return selectedActivities.some((item) => item.id === activity.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Link />
          Vincular atividades
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecionar Atividades</DialogTitle>
          <DialogDescription>Escolha uma ou mais atividades de múltipla escolha para vincular ao fluxo</DialogDescription>
        </DialogHeader>

        <SearchBar className="mt-4" searchTerm={searchTerm} placeholder="Buscar por questão ou resposta..." onSearchChange={setSearchTerm} />

        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive py-8 text-center">
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
                  className={`group flex cursor-pointer flex-col gap-2 rounded-lg border p-4 ${isActivitySelected(activity) ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  onClick={() => handleToggleActivity(activity)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isActivitySelected(activity)}
                        onCheckedChange={() => handleToggleActivity(activity)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="flex-1 text-sm font-medium">{activity.question}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      Múltipla Escolha
                    </Badge>
                  </div>
                  <p className="text-muted-foreground ml-7 text-sm">
                    <span className="font-medium">Resposta:</span> {activity.correct_answer}
                  </p>
                </div>
              ))}

              {filteredActivities.length === 0 && !isLoading && (
                <div className="text-muted-foreground py-8 text-center">
                  {activities.length === 0 ? 'Nenhuma atividade disponível.' : `Nenhuma questão encontrada para "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {selectedActivities.length} {selectedActivities.length === 1 ? 'atividade selecionada' : 'atividades selecionadas'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={selectedActivities.length === 0}>
              Vincular
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

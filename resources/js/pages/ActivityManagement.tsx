import Container from '@/components/Container'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import { Head, router } from '@inertiajs/react'
import { Plus, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import ActivityFormCard from '@/components/activity/ActivityFormCard'
import ActivityList from '@/components/activity/ActivityList'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface ActivityManagementPageProps {
  activities: Activity[]
}

const operationLabels = {
  addition: 'Adição',
  subtraction: 'Subtração', 
  multiplication: 'Multiplicação',
  division: 'Divisão'
}

export default function ActivityManagementPage({
  activities
}: ActivityManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.wrong_answers.some((answer) => answer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [activities, searchTerm])

  const groupedActivities = useMemo(() => {
    const groups: Record<string, Activity[]> = {}
    filteredActivities.forEach(activity => {
      if (!groups[activity.operation]) {
        groups[activity.operation] = []
      }
      groups[activity.operation].push(activity)
    })
    return groups
  }, [filteredActivities])

  const handleDelete = (activity: Activity) => {
    router.delete(route('activities.destroy', activity.id))
  }

  const toggleSection = (operation: string) => {
    setOpenSections(prev => ({
      ...prev,
      [operation]: !prev[operation]
    }))
  }

  return (
    <>
      <Head title="Atividades" />

      <Container
        compact
        header={
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Biblioteca de Atividades
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie todas as atividades de múltipla escolha do sistema
              </p>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar
                searchTerm={searchTerm}
                placeholder="Buscar atividades..."
                onSearchChange={setSearchTerm}
              />

              <Button onClick={() => setIsAdding(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </>
        }>
        <div className="space-y-6">
          {isAdding && <ActivityFormCard onSaved={() => setIsAdding(false)} onCancel={() => setIsAdding(false)} />}

          {Object.entries(groupedActivities).map(([operation, operationActivities], index) => (
            <Collapsible 
              key={operation} 
              open={openSections[operation]} 
              onOpenChange={() => toggleSection(operation)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-medium">
                      {operationLabels[operation as keyof typeof operationLabels] || operation}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {operationActivities.length} atividade{operationActivities.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections[operation] ? 'rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-4">
                <ActivityList activities={operationActivities} onDelete={handleDelete} />
              </CollapsibleContent>
              
              {index < Object.entries(groupedActivities).length - 1 && (
                <Separator className="my-6" />
              )}
            </Collapsible>
          ))}

          {activities.length === 0 && !isAdding && (
            <div className="text-muted-foreground text-center">
              Nenhuma atividade disponível.
            </div>
          )}

          {activities.length > 0 && filteredActivities.length === 0 && (
            <div className="text-muted-foreground text-center">
              Nenhuma atividade encontrada para "{searchTerm}".
            </div>
          )}
        </div>
      </Container>
    </>
  )
}



import Container from '@/components/Container'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import { Head, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import ActivityFormCard from '@/components/activity/ActivityFormCard'
import ActivityList from '@/components/activity/ActivityList'

interface ActivityManagementPageProps {
  activities: Activity[]
}

export default function ActivityManagementPage({
  activities
}: ActivityManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  console.log('Activities:', activities);

  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.wrong_answers.some((answer) => answer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [activities, searchTerm])

  const handleDelete = (activity: Activity) => {
    router.delete(route('activities.destroy', activity.id))
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
        <div className="space-y-4">
          {isAdding && <ActivityFormCard onSaved={() => setIsAdding(false)} onCancel={() => setIsAdding(false)} />}

          <ActivityList activities={filteredActivities} onDelete={handleDelete} />

          {activities.length === 0 && !isAdding && (
            <div className="text-muted-foreground text-center">
              {filteredActivities.length === 0 ? 'Nenhuma atividade disponível.' : `Nenhuma atividade encontrada para "${searchTerm}."`}
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

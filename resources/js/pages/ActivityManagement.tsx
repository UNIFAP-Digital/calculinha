import ActivityContent from '@/components/activity/ActivityContent'
import Container from '@/components/Container'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import { Head } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface ActivityManagementPageProps {
  activities: Activity[]
}

export default function ActivityManagementPage({ activities }: ActivityManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  return (
    <>
      <Head title="Atividades" />
      <Container>
        <div className="my-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Atividades</h1>
              <p className="text-muted-foreground mt-1">Gerencie todas as atividades de múltipla escolha do sistema</p>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar searchTerm={searchTerm} placeholder="Buscar atividades..." onSearchChange={setSearchTerm} />

              <Button onClick={() => setIsAdding(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <ActivityContent
          isAdding={isAdding}
          onAdded={() => setIsAdding(false)}
          onCancelAdding={() => setIsAdding(false)}
          activities={activities}
          searchTerm={searchTerm}
          className="mt-4"
        />
      </Container>
    </>
  )
}

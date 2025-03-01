import Container from '@/components/Container'
import FlowCard from '@/components/flow/FlowCard'
import FlowFormDialog from '@/components/flow/FlowFormDialog'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import Flow from '@/models/flow'
import { Head, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

interface FlowManagementPageProps {
  flows: Flow[]
}

export default function FlowManagementPage({ flows }: FlowManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFlow, setEditingFlow] = useState<Flow | undefined>(undefined)

  const filteredFlows = useMemo(() => {
    return flows.filter(
      (flow) => flow.name.toLowerCase().includes(searchTerm.toLowerCase()) || flow.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [flows, searchTerm])

  const handleEdit = (flow: Flow) => {
    setEditingFlow(flow)
    setIsFormOpen(true)
  }

  const handleDelete = (flow: Flow) => {
    router.delete(route('flows.destroy', flow.id))
  }

  return (
    <>
      <Head title="Trilhas" />

      <Container compact className="py-8">
        <div className="pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Trilhas</h1>
              <p className="text-muted-foreground mt-1">Gerencie todas as suas trilhas aqui.</p>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar searchTerm={searchTerm} placeholder="Buscar trilhas..." onSearchChange={setSearchTerm} />

              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFlows.map((flow) => (
            <FlowCard key={flow.id} flow={flow} onDelete={handleDelete} onEdit={handleEdit} />
          ))}

          {filteredFlows.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              {flows.length === 0 ? 'Nenhuma trilha disponível.' : `Nenhuma trilha encontrada para "${searchTerm}".`}
            </div>
          )}
        </div>
      </Container>

      <FlowFormDialog
        open={isFormOpen}
        onOpenChange={(isOpen) => {
          setEditingFlow(undefined)
          setIsFormOpen(isOpen)
        }}
        flow={editingFlow}
      />
    </>
  )
}

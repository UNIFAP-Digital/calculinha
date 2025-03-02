import { FlowHeader } from '@/components/flow/FlowHeader'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import Flow from '@/models/flow'
import Room from '@/models/room'
import { httpGet } from '@/utils/api'
import { Link, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface SelectFlowDialogProps {
  room: Room
  onSelect: (flows: Flow[]) => void
}

export default function SelectFlowDialog({ onSelect, room }: SelectFlowDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [flows, setFlows] = useState<Flow[]>([])
  const [selectedFlows, setSelectedFlows] = useState<Flow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFlows = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await httpGet<Flow[]>(route('api.flows.index', { room_id: room.id }))
      setFlows(response)
    } catch {
      setError('Erro ao carregar trilhas. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchFlows().then()
      setSelectedFlows([])
    }
  }, [isOpen, fetchFlows])

  const filteredFlows = flows.filter(
    (flow) =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) || (flow.description && flow.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleToggleFlow = (flow: Flow) => {
    setSelectedFlows((prev) => {
      const isSelected = prev.some((item) => item.id === flow.id)

      if (isSelected) {
        return prev.filter((item) => item.id !== flow.id)
      } else {
        return [...prev, flow]
      }
    })
  }

  const handleSubmit = () => {
    onSelect(selectedFlows)
    setIsOpen(false)
  }

  const isFlowSelected = (flow: Flow) => {
    return selectedFlows.some((item) => item.id === flow.id)
  }

  const handleFlowClick = (flow: Flow) => {
    handleToggleFlow(flow)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Link />
          Vincular trilhas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecionar Trilhas</DialogTitle>
          <DialogDescription>Escolha uma ou mais trilhas para vincular</DialogDescription>
        </DialogHeader>

        <SearchBar className="mt-4" searchTerm={searchTerm} placeholder="Buscar por nome ou descrição..." onSearchChange={setSearchTerm} />

        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive py-8 text-center">
              {error}
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchFlows}>
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFlows.map((flow) => (
                <div
                  key={flow.id}
                  className={`group flex cursor-pointer flex-col gap-2 rounded-lg border p-2 ${isFlowSelected(flow) ? 'bg-accent' : 'hover:bg-accent/50'}`}
                >
                  <div className="flex items-start">
                    <Checkbox
                      checked={isFlowSelected(flow)}
                      onCheckedChange={() => handleToggleFlow(flow)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 mr-2 ml-3"
                    />
                    <div className="flex-1">
                      <FlowHeader flow={flow} onClick={() => handleFlowClick(flow)} />
                    </div>
                  </div>
                </div>
              ))}

              {filteredFlows.length === 0 && !isLoading && (
                <div className="text-muted-foreground py-8 text-center">
                  {flows.length === 0 ? 'Nenhuma trilha disponível.' : `Nenhuma trilha encontrada para "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {selectedFlows.length} {selectedFlows.length === 1 ? 'trilha selecionada' : 'trilhas selecionadas'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={selectedFlows.length === 0}>
              Vincular
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

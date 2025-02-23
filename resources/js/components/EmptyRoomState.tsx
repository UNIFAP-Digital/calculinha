import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface EmptyRoomStateProps {
  onCreateRoomClick: () => void
}

export default function EmptyRoomState({ onCreateRoomClick }: EmptyRoomStateProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h3 className="text-2xl font-semibold">Nenhuma sala encontrada</h3>
        <p className="text-muted-foreground">Adicione sua primeira sala para começar</p>
        <Button onClick={onCreateRoomClick} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Adicionar Sala
        </Button>
      </div>
    </div>
  )
}

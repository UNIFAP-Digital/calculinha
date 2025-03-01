import Container from '@/components/Container'
import RoomContent from '@/components/room/RoomContent'
import RoomFormDialog from '@/components/room/RoomFormDialog'
import RoomSelector from '@/components/room/RoomSelector'
import { Button } from '@/components/ui/button'
import { useRoomTabs } from '@/hooks/useRoomTabs'
import Room from '@/models/room'
import { Head, router } from '@inertiajs/react'
import { GroupIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type RoomManagementProps = {
  rooms: Room[]
  room: Room | null
}

export default function RoomManagementPage({ rooms, room }: RoomManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { setActiveTab, activeTab } = useRoomTabs()

  const handleSelect = (selectedRoomId: number) => {
    if (selectedRoomId === room?.id) return

    router.visit(route('rooms.index', selectedRoomId) + `#${activeTab}`, {
      only: ['room'],
      preserveState: true,
    })
  }

  const handleDelete = (roomId: number) => {
    router.delete(route('rooms.destroy', roomId), {
      preserveState: true,
      onSuccess() {
        toast('Sala apagada com sucesso.')
      },
    })
  }

  return (
    <>
      <Head title="Salas" />
      <Container className="py-8">
        {rooms.length === 0 && (
          <>
            <div className="flex items-center justify-center">
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-semibold">Você ainda não tem nenhuma sala criada</h3>
                <p className="text-muted-foreground">Adicione sua primeira sala para começar</p>
                <Button onClick={() => setIsFormOpen(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Sala
                </Button>
              </div>
            </div>
          </>
        )}
        {rooms.length > 0 && (
          <div className="flex flex-col md:flex-row">
            <RoomSelector rooms={rooms} selectedRoomId={room?.id ?? null} onSelect={handleSelect} onCreate={() => setIsFormOpen(true)} />

            <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
              {room !== null ? (
                <RoomContent room={room} setActiveTab={setActiveTab} activeTab={activeTab} onDelete={handleDelete} />
              ) : (
                <div className="text-muted-foreground flex max-h-screen flex-col items-center justify-center">
                  <GroupIcon className="mb-4 size-12 opacity-75" />
                  <h3 className="mb-2 text-lg font-medium">Selecione uma sala para gerenciar</h3>
                  <p className="text-center text-sm">Escolha uma sala no painel lateral ou adicione uma nova sala</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
      <RoomFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
}

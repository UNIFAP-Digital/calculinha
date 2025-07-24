import Container from '@/components/Container'
import RoomSelector from '@/components/room/RoomSelector'
import { Button } from '@/components/ui/button'
import { Room } from '@/models'
import { Head, Link, router } from '@inertiajs/react'
import { GroupIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'

type RoomManagementProps = {
  rooms: Room[]
  currentRoom: null
}

export default function RoomIndexPage({ rooms }: RoomManagementProps) {
  const handleCreate = () => {
    router.visit(route('rooms.create'))
  }

  const handleSelect = (selectedRoom: Room) => {
    router.visit(route('rooms.show', selectedRoom.id))
  }

  const handleDelete = (room: Room) => {
    router.delete(route('rooms.destroy', room.id), {
      onSuccess() {
        toast.success('Sala apagada com sucesso.')
      },
    })
  }

  return (
    <>
      <Head title="Salas" />
      <Container>
        {rooms.length === 0 && (
          <div className="flex items-center justify-center">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-semibold">
                Você ainda não tem nenhuma sala criada
              </h3>
              <p className="text-muted-foreground">
                Adicione sua primeira sala para começar
              </p>
              <Button asChild size="lg">
                <Link href={route('rooms.create')}>
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Sala
                </Link>
              </Button>
            </div>
          </div>
        )}
        {rooms.length > 0 && (
          <div className="flex flex-col md:flex-row">
            <RoomSelector
              rooms={rooms}
              selectedRoomId={null}
              onSelect={handleSelect}
              onCreate={handleCreate}
            />

            <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
              <div className="text-muted-foreground flex max-h-screen flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8">
                <GroupIcon className="mb-4 size-12 opacity-75" />
                <h3 className="mb-2 text-lg font-medium">
                  Selecione uma sala para gerenciar
                </h3>
                <p className="text-center text-sm">
                  Escolha uma sala no painel lateral ou adicione uma nova sala
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  )
}

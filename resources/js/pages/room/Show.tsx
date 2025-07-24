import Container from '@/components/Container'
import RoomContent from '@/components/room/RoomContent'
import RoomSelector from '@/components/room/RoomSelector'
import { Button } from '@/components/ui/button'
import { useRoomTabs } from '@/hooks/useRoomTabs'
import { Room } from '@/models'
import { Head, Link, router } from '@inertiajs/react'
import { GroupIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'

type RoomShowProps = {
  rooms: Room[]
  currentRoom: Room
}

export default function RoomShowPage({ rooms, currentRoom }: RoomShowProps) {
  const { setActiveTab, activeTab } = useRoomTabs()

  const handleCreate = () => {
    router.visit(route('rooms.create'))
  }

  const handleEdit = (room: Room) => {
    router.visit(route('rooms.edit', room.id))
  }

  const handleSelect = (selectedRoom: Room) => {
    if (selectedRoom.id === currentRoom.id) return

    router.visit(route('rooms.show', selectedRoom.id) + `#${activeTab}`)
  }

  const handleDelete = (room: Room) => {
    router.delete(route('rooms.destroy', room.id), {
      onSuccess() {
        toast.success('Sala apagada com sucesso.')
        router.visit(route('rooms.index'))
      },
    })
  }

  return (
    <>
      <Head title={`Sala ${currentRoom.name}`} />
      <Container>
        <div className="flex flex-col md:flex-row">
          <RoomSelector 
            rooms={rooms} 
            selectedRoomId={currentRoom.id} 
            onSelect={handleSelect} 
            onCreate={handleCreate} 
          />

          <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
            <RoomContent
              room={currentRoom}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
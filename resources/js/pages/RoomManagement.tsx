import Container from '@/components/Container'
import EmptyRoomState from '@/components/room/EmptyRoomState'
import RoomContent from '@/components/room/RoomContent'
import RoomFormDialog from '@/components/room/RoomFormDialog'
import RoomSelector from '@/components/room/RoomSelector'
import Room from '@/models/room'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'

type RoomManagementProps = {
  rooms: Room[]
  room: Room | null
}

export default function RoomManagementPage({ rooms, room }: RoomManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleRoomSelect = (selectedRoom: Room) => {
    if (selectedRoom.id === room?.id) return

    router.visit(route('rooms.index', selectedRoom.id), {
      only: ['room'],
    })
  }

  return (
    <>
      <Head title="Salas" />
      <Container className={rooms.length === 0 ? 'my-16' : 'my-8'}>
        {rooms.length === 0 && <EmptyRoomState onCreateRoomClick={() => setIsFormOpen(true)} />}
        {rooms.length > 0 && (
          <div className="flex h-full flex-col md:flex-row">
            <RoomSelector rooms={rooms} selectedRoom={room} onSelect={handleRoomSelect} onCreate={() => setIsFormOpen(true)} />

            <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
              {room !== null ? (
                <RoomContent room={room} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">Selecione uma sala para gerenciar</div>
              )}
            </div>
          </div>
        )}
      </Container>
      <RoomFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
}

import Container from '@/components/Container'
import CreateRoomModal from '@/components/CreateRoomModal'
import EmptyRoomState from '@/components/EmptyRoomState'
import RoomContent from '@/components/RoomContent'
import RoomSelector from '@/components/RoomSelector'
import Room from '@/types/room'
import { Head } from '@inertiajs/react'
import { useState } from 'react'

type RoomManagementProps = {
  rooms: Room[]
}

export default function RoomManagement({ rooms }: RoomManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  console.log(rooms.length)
  return (
    <>
      <Head title="Salas" />
      <Container className={rooms.length === 0 ? 'my-16' : 'my-8'}>
        {rooms.length === 0 && <EmptyRoomState onCreateRoomClick={() => setIsModalOpen(true)} />}
        {rooms.length > 0 && (
          <div className="flex h-full flex-col md:flex-row">
            <RoomSelector rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} onCreateRoom={() => setIsModalOpen(true)} />

            <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
              {selectedRoom ? (
                <RoomContent room={selectedRoom} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">Selecione uma sala para gerenciar</div>
              )}
            </div>
          </div>
        )}
      </Container>
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

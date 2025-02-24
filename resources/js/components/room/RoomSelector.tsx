import CreateRoomCard from '@/components/room/CreateRoomCard'
import RoomCard from '@/components/room/RoomCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Room from '@/models/room'
import { Book, Plus } from 'lucide-react'

interface RoomSelectorProps {
  rooms: Room[]
  selectedRoom: Room | null
  onSelect: (room: Room) => void
  onCreate: () => void
}

export default function RoomSelector({ rooms, selectedRoom, onSelect, onCreate }: RoomSelectorProps) {
  return (
    <div className="md:w-80">
      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        <Select
          onValueChange={(id) => {
            const room = rooms.find((r) => r.id === Number(id))
            if (room) onSelect(room)
          }}
          value={selectedRoom?.id?.toString()}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma sala" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id.toString()}>
                <div className="flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  <span>{room.name}</span>
                  <Badge className="ml-2" variant={room.is_active ? 'default' : 'secondary'}>
                    {room.participants_count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onCreate} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Criar Nova Sala
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="space-y-3">
          <CreateRoomCard onClick={onCreate} />
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} isSelected={selectedRoom?.id === room.id} onClick={() => onSelect(room)} />
          ))}
        </div>
      </div>
    </div>
  )
}

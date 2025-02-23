import RoomTabs from '@/components/RoomTabs'
import Room from '@/types/room'

interface RoomContentProps {
  room: Room
}

export default function RoomContent({ room }: RoomContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">{room.name}</h1>
          <p className="text-gray-500">Gerencie a sala</p>
        </div>
      </div>

      <RoomTabs />
    </div>
  )
}

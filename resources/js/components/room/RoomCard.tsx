import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Room } from '@/models'
import { Book, Users } from 'lucide-react'

interface RoomCardProps {
  room: Room
  isSelected: boolean
  onClick: () => void
}

export default function RoomCard({ room, isSelected, onClick }: RoomCardProps) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary shadow-xs' : 'hover:border-gray-300'}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Book className="text-primary mr-2 h-4 w-4" />
            <div>
              <h3 className="font-medium">{room.name}</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-3 w-3" />
                <span>{room.students_count} participantes</span>
              </div>
            </div>
          </div>
          <Badge variant={room.is_active ? 'default' : 'secondary'}>{room.is_active ? 'Ativa' : 'Inativa'}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

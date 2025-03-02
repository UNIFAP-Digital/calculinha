import DestructiveActionAlertDialog from '@/components/DestructiveActionAlertDialog'
import RoomTabs from '@/components/room/RoomTabs'
import { Badge } from '@/components/ui/badge'
import Room from '@/models/room'
import { Link } from '@inertiajs/react'
import { Pencil, Play } from 'lucide-react'
import { Button } from '../ui/button'

interface RoomContentProps {
  room: Room
  activeTab: string
  setActiveTab: (tab: string) => void
  onDelete: (room: Room) => void
  onEdit: (room: Room) => void
}

export default function RoomContent({ room, setActiveTab, activeTab, onDelete, onEdit }: RoomContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold md:text-2xl">{room.name}</h1>
            <Badge variant="outline" className="font-mono">
              {room.invite_code}
            </Badge>
          </div>
          <p className="text-muted-foreground">Gerencie a sala</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href={route('quiz.index', room.id)}>
              <Play />
              Jogar
            </Link>
          </Button>

          <Button variant="outline" size="icon" onClick={() => onEdit(room)}>
            <Pencil />
          </Button>

          <DestructiveActionAlertDialog
            variant="outline"
            size="icon"
            onConfirm={() => onDelete(room)}
            description="Esta ação não pode ser desfeita. Isso irá apagar permanentemente a sala e todos os seus dados."
          />
        </div>
      </div>

      <RoomTabs room={room} setActiveTab={setActiveTab} activeTab={activeTab} />
    </div>
  )
}

import DeleteAlertDialog from '@/components/DeleteAlertDialog'
import RoomFormDialog from '@/components/room/RoomFormDialog'
import RoomTabs from '@/components/room/RoomTabs'
import { Badge } from '@/components/ui/badge'
import Room from '@/models/room'
import { Link, router } from '@inertiajs/react'
import { Pencil, Play } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

interface RoomContentProps {
  room: Room
}

export default function RoomContent({ room }: RoomContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = () => {
    router.delete(route('rooms.destroy', room.id))
    toast('Sala apagada com sucesso.')
  }

  return (
    <>
      <RoomFormDialog open={isFormOpen} onOpenChange={(v) => setIsFormOpen(v)} room={room} />

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

            <Button variant="outline" size="icon" onClick={() => setIsFormOpen(true)}>
              <Pencil />
            </Button>

            <DeleteAlertDialog
              variant="outline"
              size="icon"
              onConfirmDelete={handleDelete}
              description="Esta ação não pode ser desfeita. Isso irá apagar permanentemente a sala e todos os seus dados."
            />
          </div>
        </div>

        <RoomTabs room={room} />
      </div>
    </>
  )
}

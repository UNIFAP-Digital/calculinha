import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface CreateRoomCardProps {
  onClick: () => void
}

export default function CreateRoomCard({ onClick }: CreateRoomCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="py-4">
        <div className="flex h-[32px] items-center justify-center text-muted-foreground hover:text-primary">
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-semibold">Adicionar Sala</span>
        </div>
      </CardContent>
    </Card>
  )
}

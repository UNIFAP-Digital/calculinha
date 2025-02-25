import FlowCard from '@/components/room/tabs/flows/FlowCard'
import { FlowConnector } from '@/components/room/tabs/flows/FlowConnector'
import FlowFormDialog from '@/components/room/tabs/flows/FlowFormDialog'
import { Button } from '@/components/ui/button'
import { Flow } from '@/models/flow'
import Room from '@/models/room'
import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

interface FlowsTabProps {
  room: Room
}

export default function FlowsTab({ room }: FlowsTabProps) {
  const flows = useMemo(() => room.flows ?? [], [room])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = (flow: Flow) => {
    router.delete(route('flows.destroy', [room.id, flow.id]), {
      preserveScroll: true,
    })
  }

  const handleMoveUp = (flow: Flow) => {
    router.post(route('flows.move-up', [room.id, flow.id]), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const handleMoveDown = (flow: Flow) => {
    router.post(route('flows.move-down', [room.id, flow.id]), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  return (
    <>
      {flows.map((flow, index) => (
        <Fragment key={flow.id}>
          <FlowCard
            flow={flow}
            order={index + 1}
            isFirst={index === 0}
            isLast={index === flows.length - 1}
            onDelete={() => handleDelete(flow)}
            onMoveUp={() => handleMoveUp(flow)}
            onMoveDown={() => handleMoveDown(flow)}
          />

          <FlowConnector color={flow.color} />
        </Fragment>
      ))}

      <div className="bg-background flex justify-center rounded-lg p-4 shadow-xs">
        <Button variant="ghost" onClick={() => setIsFormOpen(true)}>
          <Plus />
          Adicionar trilha
        </Button>
      </div>

      <FlowFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} roomId={room.id} />
    </>
  )
}

import FlowCard from '@/components/room/flow/FlowCard'
import { FlowConnector } from '@/components/room/flow/FlowConnector'
import FlowFormDialog from '@/components/room/flow/FlowFormDialog'
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
  const [selectedFlow, setSelectedFlow] = useState<Flow | undefined>(undefined)

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
            onEdit={() => {
              setSelectedFlow(flow)
              setIsFormOpen(true)
            }}
            onDelete={() => handleDelete(flow)}
            onMoveUp={() => handleMoveUp(flow)}
            onMoveDown={() => handleMoveDown(flow)}
          />

          <FlowConnector color={flow.color} />
        </Fragment>
      ))}

      <div className="flex justify-center rounded-lg bg-background p-4 shadow-sm">
        <Button variant="ghost" onClick={() => setIsFormOpen(true)}>
          <Plus />
          Adicionar trilha
        </Button>
      </div>

      <FlowFormDialog
        open={isFormOpen}
        onOpenChange={() => {
          if (isFormOpen) setSelectedFlow(undefined)
          setIsFormOpen(false)
        }}
        roomId={room.id}
        flow={selectedFlow}
      />
    </>
  )
}

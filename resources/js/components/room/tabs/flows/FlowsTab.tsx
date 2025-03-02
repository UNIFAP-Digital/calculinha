import FlowActivityList from '@/components/flow/activity/FlowActivityList'
import FlowCard from '@/components/flow/FlowCard'
import { FlowConnector } from '@/components/room/tabs/flows/FlowConnector'
import { Button } from '@/components/ui/button'
import Flow from '@/models/flow'
import Room from '@/models/room'
import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { Fragment, useMemo } from 'react'

interface FlowsTabProps {
  room: Room
}

export default function FlowsTab({ room }: FlowsTabProps) {
  const flows = useMemo(() => room.flows ?? [], [room])

  const handleMove = (flow: Flow, direction: 'up' | 'down') => {
    router.post(route(`flows-.move-${direction}`, [room.id, flow.id]), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  return (
    <>
      {flows.map((flow, index) => (
        <Fragment key={flow.id}>
          <FlowCard flow={flow} order={index + 1} isFirst={index === 0} isLast={index === flows.length - 1} onMove={handleMove}>
            <FlowActivityList flow={flow} />
          </FlowCard>

          <FlowConnector color={flow.color} />
        </Fragment>
      ))}

      <div className="bg-background flex justify-center rounded-lg p-4 shadow-xs">
        <Button variant="ghost" onClick={() => {}}>
          <Plus />
          Adicionar trilha
        </Button>
      </div>
    </>
  )
}

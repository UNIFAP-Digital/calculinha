import FlowActivityList from '@/components/flow/activity/FlowActivityList'
import FlowCard from '@/components/flow/FlowCard'
import { FlowConnector } from '@/components/room/tabs/flows/FlowConnector'
import Flow from '@/models/flow'
import Room from '@/models/room'
import { router } from '@inertiajs/react'
import { Fragment, useMemo } from 'react'

interface FlowsTabProps {
  room: Room
}

export default function FlowsTab({ room }: FlowsTabProps) {
  const flows = useMemo(() => room.flows ?? [], [room])

  const handleMove = (flow: Flow, direction: 'up' | 'down') => {
    router.post(route(`rooms.flows.move-${direction}`, [room.id, flow.id]), {
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

          {index !== flows.length - 1 && <FlowConnector color={flow.color} />}
        </Fragment>
      ))}
    </>
  )
}

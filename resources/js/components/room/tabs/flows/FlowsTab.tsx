import FlowActivityList from '@/components/flow/activity/FlowActivityList'
import FlowCard from '@/components/flow/FlowCard'
import SelectFlowDialog from '@/components/flow/SelectFlowDialog'
import { FlowConnector } from '@/components/room/tabs/flows/FlowConnector'
import Flow from '@/models/flow'
import Room from '@/models/room'
import { router } from '@inertiajs/react'
import { Fragment, useMemo } from 'react'

interface FlowsTabProps {
  room: Room
}

const preserveAll = {
  preserveScroll: true,
  preserveState: true,
  preserveUrl: true,
}

export default function FlowsTab({ room }: FlowsTabProps) {
  const flows = useMemo(() => room.flows ?? [], [room])

  const handleMove = (flow: Flow, direction: 'up' | 'down') => {
    router.post(route(`rooms.flows.move-${direction}`, [room.id, flow.id]), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const handleLink = (flows: Flow[]) => {
    router.post(route('rooms.flows.store', room.id), { flow_ids: flows.map((flow) => flow.id) }, preserveAll)
  }

  const handleUnlink = (flow: Flow) => {
    router.delete(route('rooms.flows.destroy', [room.id, flow.id]), preserveAll)
  }

  return (
    <>
      {flows.map((flow, index) => (
        <Fragment key={flow.id}>
          <FlowCard flow={flow} order={index + 1} isFirst={index === 0} isLast={index === flows.length - 1} onMove={handleMove} onUnlink={handleUnlink}>
            <FlowActivityList flow={flow} />
          </FlowCard>

          <FlowConnector color={flow.color} />
        </Fragment>
      ))}

      <div className="bg-background flex justify-center rounded-lg p-4 shadow-xs">
        <SelectFlowDialog onSelect={handleLink} room={room} />
      </div>
    </>
  )
}

import ModuleActivityList from '@/components/module/activity/ModuleActivityList'
import ModuleCard from '@/components/module/ModuleCard'
import { ModuleConnector } from '@/components/room/tabs/modules/ModuleConnector'
import Module from '@/models/module'
import Room from '@/models/room'
import { router } from '@inertiajs/react'
import { Fragment, useMemo } from 'react'

interface ModulesTabProps {
  room: Room
}

export default function ModulesTab({ room }: ModulesTabProps) {
  const modules = useMemo(() => room.modules ?? [], [room])

  const handleMove = (module: Module, direction: 'up' | 'down') => {
    router.post(route(`rooms.modules.move-${direction}`, [room.id, module.id]), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  return (
    <>
      {modules.map((module, index) => (
        <Fragment key={module.id}>
          <ModuleCard module={module} order={index + 1} isFirst={index === 0} isLast={index === modules.length - 1} onMove={handleMove}>
            <ModuleActivityList module={module} />
          </ModuleCard>

          {index !== modules.length - 1 && <ModuleConnector color={module.color} />}
        </Fragment>
      ))}
    </>
  )
}

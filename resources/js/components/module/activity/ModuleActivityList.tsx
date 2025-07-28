import { Activity } from '@/models/activity'
import { Module } from '@/models/module'
import { router } from '@inertiajs/react'
import { Reorder } from 'motion/react'
import { useState } from 'react'
import ModuleActivityItem from './ModuleActivityItem'

interface ModuleActivitiesListProps {
  module: Module
  activities: Activity[]
}

export default function ModuleActivitiesList({ module }: ModuleActivitiesListProps) {
  const [items, setItems] = useState<Activity[]>(module.activities || [])

  const handleReposition = (activity: Activity, newPosition: number) => {
    router.post(
      route('modules.activities.reposition', [module.id, activity.id]),
      {
        position: newPosition,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    )
  }

  const handleReorder = (newOrderedItems: Activity[]) => {
    // Encontra qual item foi movido
    const movedItemIndex = newOrderedItems.findIndex((item, index) => {
      return items[index]?.id !== item.id
    })

    if (movedItemIndex !== -1) {
      const movedActivity = newOrderedItems[movedItemIndex]

      // Atualiza o estado local imediatamente para feedback visual
      setItems(newOrderedItems)

      // Chama o backend para reposicionar o item
      handleReposition(movedActivity, movedItemIndex)
    }
  }

  // Se não há atividades, não renderiza nada
  if (!items || items.length === 0) {
    return null
  }

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
      {items.map((activity) => (
        <ModuleActivityItem key={activity.id} activity={activity} />
      ))}
    </Reorder.Group>
  )
}

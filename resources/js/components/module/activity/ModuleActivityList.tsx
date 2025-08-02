import { Activity } from '@/models/activity'
import { Module } from '@/models/module'
import { Reorder } from 'motion/react'
import { useState } from 'react'
import ModuleActivityItem from './ModuleActivityItem'

interface ModuleActivitiesListProps {
  module: Module
  activities: Activity[]
}

export default function ModuleActivitiesList({ module }: ModuleActivitiesListProps) {
  const [items, setItems] = useState<Activity[]>(module.activities || [])

  
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

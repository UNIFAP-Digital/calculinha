import { FlowActivity } from '@/models/flow-activity'
import Stats from '@/models/stats'

export interface Flow {
  id: number
  name: string
  position: number
  description: string | null
  color: string
  icon: string
  room_id: number
  flow_activities_count?: number
  flow_activities?: FlowActivity[]
  stats?: Stats
}

import { FlowActivity } from '@/models/flow-activity'

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
}

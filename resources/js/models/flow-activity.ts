import { Activity } from '@/models/activity'

export interface FlowActivity {
  id: number
  flow_id: number
  activity_id: number
  position: number

  activity?: Activity
}

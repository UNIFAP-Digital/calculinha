import { Activity } from '@/models/activity'
import { Attempt } from '@/models/attempt'

export interface FlowActivity {
  id: number
  flow_id: number
  activity_id: number
  position: number

  activity?: Activity
  attempt?: Attempt
}

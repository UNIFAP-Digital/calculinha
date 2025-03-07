import { Operation } from '@/models/operation'
import { Status } from '@/models/status'
import type { Activity } from './activity'
import type { Stats } from './stats'

export interface Module {
  id: number
  name: string 
  description: string | null
  operation: Operation | null
  created_at: string
  updated_at: string

  activities_count?: number
  status?: Status
  order?: number
  activities?: Activity[]
  stats?: Stats
}

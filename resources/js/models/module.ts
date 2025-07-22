import type { Operation } from '@/models/operation'
import type { Status } from '@/models/status'
import type { Type } from '@/models/type'
import type { Activity } from './activity'
import type { Stats } from './stats'

export interface Module {
  id: number
  name: string | null
  description: string | null
  operation: Operation | null
  type: Type
  created_at: string
  updated_at: string
  score: number
  activities_count?: number
  activities_completed?: number
  status?: Status
  order?: number
  activities?: Activity[]
  stats?: Stats
  no_feedback?: boolean
  icon?: string | null
  color?: string | null
}

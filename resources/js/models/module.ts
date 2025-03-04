import type { Activity } from './activity'
import type { Stats } from './stats'

export interface Module {
  id: number
  name: string | null
  description: string | null
  color: string | null
  icon: string | null
  created_at: string
  updated_at: string

  activities_count?: number
  is_completed?: boolean
  order?: number
  activities?: Activity[]
  stats?: Stats
}

import { Activity } from '@/models/activity'
import Stats from '@/models/stats'

export default interface Flow {
  id: number
  name: string
  description: string | null
  color: string
  icon: string

  activities_count?: number

  position?: number
  activities?: Activity[]
  stats?: Stats
}

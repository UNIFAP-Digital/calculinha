import Activity from './activity'
import Stats from './stats'

export default interface Module {
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

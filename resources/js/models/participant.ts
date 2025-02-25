import { Flow } from '@/models/flow'
import Stats from '@/models/stats'

export default interface Participant {
  id: number
  name: string
  created_at: string
  flows?: Flow[]
  stats: Stats
}

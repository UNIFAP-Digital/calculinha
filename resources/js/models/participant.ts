import Flow from './flow'
import Stats from './stats'

export default interface Participant {
  id: number
  name: string
  created_at: string
  flows?: Flow[]
  stats: Stats
}

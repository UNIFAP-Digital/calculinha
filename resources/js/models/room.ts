import Module from './module'
import Participant from './participant'

export default interface Room {
  id: number
  name: string
  is_active: boolean
  participants_count?: number
  participants?: Participant[]
  modules?: Module[]
  invite_code: string
}

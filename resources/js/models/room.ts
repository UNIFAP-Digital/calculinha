import Flow from './flow'
import Participant from './participant'

export default interface Room {
  id: number
  name: string
  is_active: boolean
  participants_count?: number
  participants?: Participant[]
  flows?: Flow[]
  invite_code: string
}

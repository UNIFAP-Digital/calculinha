import { Flow } from '@/models/flow'
import Participant from '@/models/participant'

export default interface Room {
  id: number
  name: string
  is_active: boolean
  participants_count?: number
  participants?: Participant[]
  flows?: Flow[]
  invite_code: string
}

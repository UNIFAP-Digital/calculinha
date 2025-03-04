import { Attempt } from '@/models/attempt'

export interface Student {
  id: number
  name: string
  created_at: string
  updated_at: string

  attempts?: Attempt[]
}

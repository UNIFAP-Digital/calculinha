import { Operation } from '@/models/operation'

export interface Activity {
  id: number
  question: string
  correct_answer: string
  wrong_answers: string[]
  type: string
  operation: Operation
  created_at: string
  updated_at?: string

  answer?: string
  is_correct?: boolean
  position?: number
}

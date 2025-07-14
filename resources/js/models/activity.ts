import { Operation } from '@/models/operation'

export interface Activity {
  id: number
  content: {
    question: string
    options: string[]
    correct_answer_id: number
  }
  type: string
  operation: Operation
  created_at: string
  updated_at?: string

  answer?: string
  is_correct?: boolean
  order?: number
}

import type { Module } from './module'
import type { Student } from './student'

export interface Room {
  id: number
  name: string
  is_active: boolean
  students_count?: number
  students?: Student[]
  modules?: Module[]
  invite_code: string
}

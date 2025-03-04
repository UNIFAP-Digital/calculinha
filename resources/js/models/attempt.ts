import type { Module } from '@/models/module'
import type { Stats } from '@/models/stats'

export interface Attempt {
  id: number
  is_completed: boolean
  created_at: string
  updated_at: string

  modules: Module[]
  total_stats: Stats
}

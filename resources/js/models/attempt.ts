import type { Module } from '@/models/module'
import type { Stats } from '@/models/stats'
import { Status } from '@/models/status'

export interface Attempt {
  id: number
  status: Status
  created_at: string
  updated_at: string

  modules: Module[]
  total_stats: Stats
}

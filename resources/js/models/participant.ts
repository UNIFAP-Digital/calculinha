import Module from './module'
import Stats from './stats'

export default interface Participant {
  id: number
  name: string
  created_at: string
  modules?: Module[]
  stats: Stats
}

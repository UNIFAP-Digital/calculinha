export default interface Room {
  id: number
  name: string
  is_active: boolean
  participants_count?: number
  invite_code: string
}

export interface User {
  id: number
  type: 'student' | 'web'
  name: string
  email: string
  email_verified_at?: string
}

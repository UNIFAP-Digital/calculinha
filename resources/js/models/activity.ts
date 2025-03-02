export default interface Activity {
  id: number
  question: string
  correct_answer: string
  wrong_answers: string[]
  type: string

  position?: number
}

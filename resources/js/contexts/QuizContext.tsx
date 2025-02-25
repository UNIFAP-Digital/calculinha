import { FlowActivity } from '@/models/flow-activity'
import { createContext, ReactNode, useContext, useState } from 'react'

interface QuizAnswer {
  flowActivityId: number | string
  answer: string
}

interface QuizState {
  gameState: 'start' | 'playing' | 'finished'
  currentActivityIndex: number
  selectedAnswer: string | null
  score: number
  answers: QuizAnswer[]
  currentActivity: FlowActivity
  totalActivities: number
}

interface QuizActions {
  startGame: () => void
  handleAnswerSelect: (answer: string) => void
  nextActivity: () => void
  resetQuiz: () => void
}

type QuizContextValue = QuizState & QuizActions

interface QuizProviderProps {
  children: ReactNode
  flowActivities: FlowActivity[]
  onComplete?: (score: number, answers: QuizAnswer[]) => void
}

// Criando o contexto
const QuizContext = createContext<QuizContextValue | undefined>(undefined)

// Provedor do contexto
export function QuizProvider({ children, flowActivities, onComplete }: QuizProviderProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start')
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])

  const startGame = () => {
    setGameState('playing')
    setCurrentActivityIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswers([])
  }

  const resetQuiz = () => {
    setGameState('start')
    setCurrentActivityIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswers([])
  }

  const handleAnswerSelect = (answer: string) => {
    const currentFlowActivity = flowActivities[currentActivityIndex]
    setSelectedAnswer(answer)

    if (answer === currentFlowActivity.activity!.correct_answer) {
      setScore((prev) => prev + 1)
    }

    const answerData: QuizAnswer = {
      flowActivityId: currentFlowActivity.id,
      answer: answer,
    }

    setAnswers((prev) => [...prev, answerData])
  }

  const nextActivity = () => {
    if (currentActivityIndex < flowActivities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      setGameState('finished')
      onComplete?.(score, answers)
    }
  }

  // Valor do contexto
  const contextValue: QuizContextValue = {
    gameState,
    currentActivityIndex,
    selectedAnswer,
    score,
    answers,
    startGame,
    handleAnswerSelect,
    nextActivity,
    resetQuiz,
    currentActivity: flowActivities[currentActivityIndex],
    totalActivities: flowActivities.length,
  }

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const context = useContext(QuizContext)

  if (context === undefined) {
    throw new Error('useQuiz deve ser usado dentro de um QuizProvider')
  }

  return context
}

export type { QuizAnswer }

import { FlowActivity } from '@/models/flow-activity'
import { atom, useAtom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { createContext, ReactNode, useContext } from 'react'
import { assign, setup } from 'xstate'

export interface QuizAnswer {
  flowActivityId: number | string
  answer: string
}

export const flowActivitiesAtom = atom<FlowActivity[]>([])

const createQuizMachine = (flowActivities: FlowActivity[]) =>
  setup({
    types: {
      context: {} as {
        flowActivities: FlowActivity[]
        selectedAnswer: string | null
        score: number
        totalActivities: number
        currentActivityIndex: number
        answers: QuizAnswer[]
        gameState: 'start' | 'playing' | 'finished'
      },
      events: {} as { type: 'START_GAME' } | { type: 'SELECT_ANSWER'; answer: string } | { type: 'NEXT_ACTIVITY' } | { type: 'RESET_QUIZ' },
    },
  }).createMachine({
    id: 'quiz',
    initial: 'idle',
    context: {
      flowActivities,
      selectedAnswer: null,
      score: 0,
      totalActivities: flowActivities.length,
      currentActivityIndex: 0,
      answers: [],
      gameState: 'start',
    },
    states: {
      idle: {
        on: {
          START_GAME: {
            target: 'playing',
            actions: assign({
              currentActivityIndex: 0,
              score: 0,
              selectedAnswer: null,
              answers: [],
              gameState: 'playing',
            }),
          },
        },
      },
      playing: {
        on: {
          SELECT_ANSWER: {
            target: 'answered',
            actions: [
              assign({
                selectedAnswer: ({ event }) => event.answer,
              }),
              assign({
                score: ({ context, event }) => {
                  const currentActivity = context.flowActivities[context.currentActivityIndex]
                  return event.answer === currentActivity.activity?.correct_answer ? context.score + 1 : context.score
                },
                answers: ({ context, event }) => {
                  const currentActivity = context.flowActivities[context.currentActivityIndex]
                  const answerData: QuizAnswer = {
                    flowActivityId: currentActivity.id,
                    answer: event.answer,
                  }
                  return [...context.answers, answerData]
                },
              }),
            ],
          },
          RESET_QUIZ: {
            target: 'idle',
            actions: assign({
              currentActivityIndex: 0,
              score: 0,
              selectedAnswer: null,
              answers: [],
              gameState: 'start',
            }),
          },
        },
      },
      answered: {
        on: {
          NEXT_ACTIVITY: [
            {
              target: 'playing',
              guard: ({ context }) => context.currentActivityIndex < context.totalActivities - 1,
              actions: assign({
                currentActivityIndex: ({ context }) => context.currentActivityIndex + 1,
                selectedAnswer: null,
              }),
            },
            {
              target: 'finished',
              actions: assign({
                gameState: 'finished',
              }),
            },
          ],
          RESET_QUIZ: {
            target: 'idle',
            actions: assign({
              currentActivityIndex: 0,
              score: 0,
              selectedAnswer: null,
              answers: [],
              gameState: 'start',
            }),
          },
        },
      },
      finished: {
        on: {
          RESET_QUIZ: {
            target: 'idle',
            actions: assign({
              currentActivityIndex: 0,
              score: 0,
              selectedAnswer: null,
              answers: [],
              gameState: 'start',
            }),
          },
        },
      },
    },
  })

export const quizMachineAtom = atomWithMachine((get) => createQuizMachine(get(flowActivitiesAtom)))

interface QuizContextValue {
  gameState: 'start' | 'playing' | 'finished'
  currentActivityIndex: number
  selectedAnswer: string | null
  score: number
  answers: QuizAnswer[]
  currentActivity: FlowActivity | undefined
  totalActivities: number
  startGame: () => void
  handleAnswerSelect: (answer: string) => void
  nextActivity: () => void
  resetQuiz: () => void
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined)

interface QuizProviderProps {
  children: ReactNode
  flowActivities: FlowActivity[]
  onComplete?: (score: number, answers: QuizAnswer[]) => void
}

export function QuizProvider({ children, flowActivities, onComplete }: QuizProviderProps) {
  const [, setFlowActivities] = useAtom(flowActivitiesAtom)
  setFlowActivities(flowActivities)

  const [state, send] = useAtom(quizMachineAtom)

  const { gameState, currentActivityIndex, selectedAnswer, score, answers, totalActivities } = state.context

  const currentActivity = flowActivities[currentActivityIndex]

  const startGame = () => send({ type: 'START_GAME' })

  const handleAnswerSelect = (answer: string) => send({ type: 'SELECT_ANSWER', answer })

  const nextActivity = () => {
    if (currentActivityIndex === totalActivities - 1) {
      if (onComplete) {
        onComplete(score, answers)
      }
    }
    send({ type: 'NEXT_ACTIVITY' })
  }

  const resetQuiz = () => send({ type: 'RESET_QUIZ' })

  const contextValue: QuizContextValue = {
    gameState,
    currentActivityIndex,
    selectedAnswer,
    score,
    answers,
    currentActivity,
    totalActivities,
    startGame,
    handleAnswerSelect,
    nextActivity,
    resetQuiz,
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

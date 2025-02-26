import { Flow } from '@/models/flow'
import { httpPost } from '@/utils/api'
import { atom, useAtom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { toast } from 'sonner'
import { assign, setup } from 'xstate'

export interface QuizAnswer {
  flowActivityId: number | string
  answer: string
}

interface ContextGameMachine {
  flows: Flow[]
  currentFlowId: number
  currentActivityIndex: number
  selectedAnswer: string | null
  score: number
  totalActivities: number
  answers: QuizAnswer[]
  completed_flows: Array<number>
}

const defaultContextGameMachine = {
  flows: [],
  currentFlowId: 0,
  currentActivityIndex: 0,
  selectedAnswer: null,
  score: 0,
  totalActivities: 0,
  answers: [],
  completed_flows: [],
} satisfies ContextGameMachine

export const flowsAtom = atom<Flow[]>([])

const createGameMachine = (flows: Flow[], completed_flows: number[]) =>
  setup({
    types: {
      context: {} as ContextGameMachine,
      events: {} as
        | { type: 'SET_FLOW'; flowId: number }
        | { type: 'START_QUIZ' }
        | { type: 'SELECT_ANSWER'; answer: string }
        | { type: 'NEXT_QUESTION' }
        | { type: 'RESET' },

      input: {} as {
        flows: Flow[]
        completed_flows: number[]
      },
    },
  }).createMachine({
    id: 'game',
    initial: 'Idle',
    context: ({ input }) => ({
      flows,
      currentFlowId: 0,
      currentActivityIndex: 0,
      selectedAnswer: null,
      score: 0,
      totalActivities: input.flows.reduce((total, flow) => total + (flow.flow_activities?.length || 0), 0),
      answers: [],
      completed_flows: input.completed_flows,
    }),
    states: {
      Idle: {
        id: 'idle',
        on: {
          SET_FLOW: {
            target: 'Flow_Selected',
            actions: assign({
              currentFlowId: ({ event }) => event.flowId,
              currentActivityIndex: 0,
              selectedAnswer: null,
              score: 0,
              answers: [],
              totalActivities: ({ context, event }) => {
                if (event.flowId === null) return 0
                const flow = context.flows.find((f) => f.id === event.flowId)
                return flow?.flow_activities?.length || 0
              },
            }),
            guard: ({ event }) => event.flowId !== null,
          },
        },
      },
      Flow_Selected: {
        initial: 'intro',
        states: {
          intro: {
            on: {
              START_QUIZ: {
                target: 'playing',
                actions: assign({
                  currentActivityIndex: 0,
                  selectedAnswer: null,
                  score: 0,
                  answers: [],
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
                  assign(({ context, event }) => {
                    const currentFlow = context.flows.find((f) => f.id === context.currentFlowId)
                    if (!currentFlow || !currentFlow.flow_activities || !context.currentActivityIndex) return {}

                    const currentActivity = currentFlow.flow_activities[context.currentActivityIndex]
                    const isCorrect = event.answer === currentActivity.activity?.correct_answer

                    const answerData: QuizAnswer = {
                      flowActivityId: currentActivity.id,
                      answer: event.answer,
                    }

                    return {
                      score: isCorrect ? context.score + 1 : context.score,
                      answers: [...context.answers, answerData],
                    }
                  }),
                ],
              },
            },
          },
          answered: {
            on: {
              NEXT_QUESTION: [
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
                },
              ],
            },
          },
          finished: {
            on: {
              RESET: {
                target: 'Idle',
                actions: [
                  assign({
                    completed_flows: ({ context }) => context.completed_flows.concat([context.currentFlowId]),
                  }),
                  assign({
                    currentFlowId: 0,
                    currentActivityIndex: 0,
                    selectedAnswer: null,
                    score: 0,
                    answers: [],
                  }),
                ],
              },
            },
          },
        },
        on: {
          RESET: {
            target: 'Idle',
            actions: assign(defaultContextGameMachine),
          },
        },
      },
    },
  })

const gameMachineAtom = atomWithMachine((get) => createGameMachine())

// Função para obter informações derivadas do estado atual
export function useGameMachine(isAuthenticated: boolean) {
  const [flows, setFlows] = useAtom(flowsAtom)
  const [state, send] = useAtom(gameMachineAtom)

  const { currentFlowId, currentActivityIndex, selectedAnswer, score, answers, totalActivities } = state.context

  // Valores derivados
  const currentFlow = flows.find((f) => f.id === currentFlowId) || null
  const currentActivity = currentFlow?.flow_activities?.[currentActivityIndex] || null
  const gameState = state.value

  // Ações da máquina
  const setFlow = (flowId: number) => {
    send({ type: 'SET_FLOW', flowId })
  }

  const startQuiz = () => {
    send({ type: 'START_QUIZ' })
  }

  const selectAnswer = (answer: string) => {
    send({ type: 'SELECT_ANSWER', answer })
  }

  const nextQuestion = () => {
    // Se for a última pergunta, também enviamos os resultados
    if (currentActivityIndex === totalActivities - 1 && currentFlow) {
      handleQuizComplete(score, answers, currentFlow, isAuthenticated).then()
    }

    send({ type: 'NEXT_QUESTION' })
  }

  const resetQuiz = () => {
    send({ type: 'RESET' })
  }

  // Função para enviar resultados
  const handleQuizComplete = async (score: number, answers: QuizAnswer[], flow: Flow, isAuthenticated: boolean) => {
    if (isAuthenticated) return

    try {
      const attempts = answers.map((answer) => ({
        flow_activity_id: answer.flowActivityId,
        answer: answer.answer,
      }))

      await httpPost(route('quiz.result', flow.room_id), { attempts })

      toast('Resultados enviados', {
        description: `Sua pontuação: ${score} de ${flow.flow_activities?.length}`,
      })
    } catch {
      toast('Erro ao enviar resultados', {
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return {
    // Estados
    flows,
    currentFlow,
    currentActivity,
    currentActivityIndex,
    selectedAnswer,
    score,
    totalActivities,
    answers,
    gameState,

    // Ações
    setFlows,
    setFlow,
    startQuiz,
    selectAnswer,
    nextQuestion,
    resetQuiz,
  }
}

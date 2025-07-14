import { Activity, Module } from '@/models'
import { assign, setup } from 'xstate'

export interface QuizMachineContext {
  module: Module & { activities: Activity[] }
  currentActivityIndex: number
  selectedAnswer: string | null
  isCorrectAnswer: boolean | null
  hits: number
  mistakes: number
  totalActivities: number
  timeSpent: number
  startTime: number
}

type QuizMachineEvents = 
  | { type: 'start' }
  | { type: 'select_answer'; answer: string }
  | { type: 'next_question' }
  | { type: 'reset' }
  | { type: 'finish_quiz' }

const createInitialContext = (module: Module & { activities: Activity[] }): QuizMachineContext => ({
  module,
  currentActivityIndex: 0,
  selectedAnswer: null,
  isCorrectAnswer: null,
  hits: 0,
  mistakes: 0,
  totalActivities: module.activities.length,
  timeSpent: 0,
  startTime: 0,
})

export const quizMachine = setup({
  types: {
    context: {} as QuizMachineContext,
    events: {} as QuizMachineEvents,
    input: {} as {
      module: Module & { activities: Activity[] }
    },
  },
  guards: {
    hasMoreQuestions: ({ context }) => context.currentActivityIndex < context.totalActivities - 1,
  },
}).createMachine({
  id: 'quiz',
  initial: 'intro',
  context: ({ input }) => createInitialContext(input.module),
  states: {
    intro: {
      on: {
        start: {
          target: 'playing',
          actions: assign({ startTime: () => Date.now() }),
        },
      },
    },
    playing: {
      initial: 'answering',
      states: {
        answering: {
          entry: assign({
            selectedAnswer: null,
            isCorrectAnswer: null,
          }),
          on: {
            select_answer: {
              target: 'answered',
              actions: assign(({ context, event }) => {
                const currentActivity = context.module.activities[context.currentActivityIndex]
                const isCorrect = currentActivity.correct === event.answer
                return {
                  selectedAnswer: event.answer,
                  isCorrectAnswer: isCorrect,
                  hits: isCorrect ? context.hits + 1 : context.hits,
                  mistakes: !isCorrect ? context.mistakes + 1 : context.mistakes,
                }
              }),
            },
          },
        },
        answered: {
          on: {
            next_question: [
              {
                guard: { type: 'hasMoreQuestions' },
                target: 'answering',
                actions: assign({
                  currentActivityIndex: ({ context }) => context.currentActivityIndex + 1,
                }),
              },
              {
                target: '#quiz.finished',
              },
            ],
          },
        },
      },
    },
    finished: {
      type: 'final',
      on: {
        reset: {
          target: 'intro',
          actions: assign(({ context }) => createInitialContext(context.module)),
        },
      },
    },
  },
})

export default quizMachine
import { Module } from '@/models'
import { assign, setup } from 'xstate'

export type GameModule = Omit<Module, 'activities'> & Required<Pick<Module, 'activities'>>

export interface GameMachineContext {
  module: GameModule
  currentActivityId: number
  currentActivityIndex: number
  correctAnswer: string | null
  isCorrectAnswer: boolean | null
  selectedAnswer: string | null
  totalActivities: number
  hits: number
  mistakes: number
}

type GameMachineEvents = 
  | { type: 'start' } 
  | { type: 'commitAnswer'; answer: string } 
  | { type: 'nextActivity' } 
  | { type: 'reset' }

const defaultGameMachineContext = (module: GameModule): GameMachineContext => ({
  module: module,
  currentActivityId: 0,
  currentActivityIndex: 0,
  correctAnswer: null,
  isCorrectAnswer: null,
  selectedAnswer: null,
  hits: 0,
  mistakes: 0,
  totalActivities: module.activities.length,
})

export const gameMachine = setup({
  types: {
    context: {} as GameMachineContext,
    events: {} as GameMachineEvents,
    input: {} as {
      module: GameModule
    },
  },
  guards: {
    hasMoreActivities: ({ context }) => context.currentActivityIndex < context.module.activities.length - 1,
    finishedModule: ({ context }) => context.currentActivityIndex === context.module.activities.length - 1,
  },
}).createMachine({
  id: 'gameMachine',
  initial: 'intro',
  context: ({ input }) => defaultGameMachineContext(input.module),
  states: {
    intro: {
      on: {
        start: {
          target: 'playing',
        },
      },
    },
    playing: {
      initial: 'answering',
      states: {
        answering: {
          entry: assign({
            correctAnswer: ({ context }) => context.module.activities[context.currentActivityIndex].correct_answer,
            currentActivityId: ({ context }) => context.module.activities[context.currentActivityIndex].id,
          }),
          on: {
            commitAnswer: {
              target: 'answered',
              actions: assign(({ context, event }) => {
                const isCorrect = context.module.activities[context.currentActivityIndex].correct_answer === event.answer
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
          exit: assign({
            selectedAnswer: null,
            isCorrectAnswer: null,
          }),
          on: {
            nextActivity: [
              {
                guard: 'hasMoreActivities',
                target: 'answering',
                actions: assign({
                  currentActivityIndex: ({ context }) => context.currentActivityIndex + 1,
                }),
              },
              {
                guard: 'finishedModule',
                target: '#gameMachine.result',
              },
            ],
          },
        },
      },
    },
    result: {
      on: {
        reset: {
          target: 'intro',
          actions: assign(({ context }) => defaultGameMachineContext(context.module)),
        },
      },
    },
  },
})

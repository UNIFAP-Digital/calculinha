import { GameFlow } from '@/pages/game/GameSelect'
import { assign, setup } from 'xstate'

export interface GameMachineContext {
  flow: GameFlow
  currentActivityId: number
  currentActivityIndex: number
  correctAnswer: string | null
  isCorrectAnswer: boolean | null
  selectedAnswer: string | null
  score: number
  totalActivities: number
  hits: number
  mistakes: number
}

type GameMachineEvents = { type: 'start' } | { type: 'answer-selected'; answer: string } | { type: 'next-activity' } | { type: 'reset' }

const defaultGameMachineContext = (flow: GameFlow): GameMachineContext => ({
  flow: flow,
  currentActivityId: 0,
  currentActivityIndex: 0,
  correctAnswer: null,
  isCorrectAnswer: null,
  selectedAnswer: null,
  score: 0,
  hits: 0,
  mistakes: 0,
  totalActivities: flow.activities.length,
})

export const gameMachine = setup({
  types: {
    context: {} as GameMachineContext,
    events: {} as GameMachineEvents,
    input: {} as {
      flow: GameFlow
    },
  },
  guards: {
    hasMoreActivities: ({ context }) => context.currentActivityIndex < context.flow.activities.length - 1,
    finishedFlow: ({ context }) => context.currentActivityIndex === context.flow.activities.length - 1,
  },
}).createMachine({
  initial: 'intro',
  context: ({ input }) => defaultGameMachineContext(input.flow),
  states: {
    intro: {
      on: {
        start: {
          target: 'answering',
        },
      },
    },
    answering: {
      entry: assign({
        correctAnswer: ({ context }) => context.flow.activities[context.currentActivityIndex].correct_answer,
        currentActivityId: ({ context }) => context.flow.activities[context.currentActivityIndex].id,
      }),
      on: {
        'answer-selected': {
          target: 'answered',
          actions: [
            assign({
              selectedAnswer: ({ event }) => event.answer,
              isCorrectAnswer: ({ context, event }) => context.flow.activities[context.currentActivityIndex].correct_answer === event.answer,
            }),
            assign({
              score: ({ context }) => (context.isCorrectAnswer ? ++context.score : context.score),
              hits: ({ context }) => (context.isCorrectAnswer ? ++context.hits : context.hits),
              mistakes: ({ context }) => (!context.isCorrectAnswer ? ++context.mistakes : context.mistakes),
            }),
          ],
        },
      },
    },
    answered: {
      exit: assign({
        selectedAnswer: null,
        isCorrectAnswer: null,
      }),
      on: {
        'next-activity': [
          {
            guard: { type: 'hasMoreActivities' },
            target: 'answering',
            actions: assign({
              currentActivityIndex: ({ context }) => context.currentActivityIndex + 1,
            }),
          },
          {
            guard: { type: 'finishedFlow' },
            target: 'result',
          },
        ],
      },
    },
    result: {
      on: {
        reset: {
          target: 'intro',
          actions: assign(({ context }) => defaultGameMachineContext(context.flow)),
        },
      },
    },
  },
})

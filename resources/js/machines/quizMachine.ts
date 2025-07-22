import { Activity, Module } from '@/models'
import { assign, setup } from 'xstate'

export type QuizType = 'pre-test' | 'post-test' | 'practice'
export type FeedbackMode = 'immediate' | 'none'

export interface QuizMachineContext {
  module: Module & { activities: Activity[] }
  quizType: QuizType
  feedbackMode: FeedbackMode
  currentActivityIndex: number
  selectedAnswer: string | null
  isCorrectAnswer: boolean | null
  hits: number
  mistakes: number
  totalActivities: number
  timeSpent: number
  startTime: number
  currentQuestionStartTime: number
  shuffledOptions: string[][]
  correctIndices: number[]
  answers: Array<{
    activityId: number
    selectedAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
}

type QuizMachineEvents = 
  | { type: 'start'; quizType?: QuizType }
  | { type: 'select_answer'; answer: string }
  | { type: 'submit_answer' }
  | { type: 'next_question' }
  | { type: 'reset' }
  | { type: 'finish_quiz' }

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const createInitialContext = (
  module: Module & { activities: Activity[] },
  quizType: QuizType = 'practice'
): QuizMachineContext => {
  // Create shuffled options for each activity
  const shuffledOptions: string[][] = []
  const correctIndices: number[] = []
  
  module.activities.forEach(activity => {
    const originalOptions = activity.content.options
    const shuffled = shuffleArray([...originalOptions])
    const correctAnswer = originalOptions[activity.content.correct_answer_id]
    const correctIndex = shuffled.indexOf(correctAnswer)
    
    shuffledOptions.push(shuffled)
    correctIndices.push(correctIndex)
  })
  
  return {
    module,
    quizType,
    feedbackMode: (module.no_feedback || quizType === 'pre-test' || quizType === 'post-test') ? 'none' : 'immediate',
    currentActivityIndex: 0,
    selectedAnswer: null,
    isCorrectAnswer: null,
    hits: 0,
    mistakes: 0,
    totalActivities: module.activities.length,
    timeSpent: 0,
    startTime: 0,
    currentQuestionStartTime: 0,
    shuffledOptions,
    correctIndices,
    answers: [],
  }
}

export const quizMachine = setup({
  types: {
    context: {} as QuizMachineContext,
    events: {} as QuizMachineEvents,
    input: {} as {
      module: Module & { activities: Activity[] }
      quizType?: QuizType
    },
  },
  guards: {
    hasMoreQuestions: ({ context }) => context.currentActivityIndex < context.totalActivities - 1,
    hasFeedback: ({ context }) => context.feedbackMode === 'immediate',
  },
}).createMachine({
  id: 'quiz',
  initial: 'intro',
  context: ({ input }) => createInitialContext(input.module, input.quizType),
  states: {
    intro: {
      on: {
        start: {
          target: 'playing',
          actions: assign(({ context, event }) => ({
            startTime: Date.now(),
            currentQuestionStartTime: Date.now(),
            quizType: event.quizType || 'practice',
          })),
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
            currentQuestionStartTime: () => Date.now(),
          }),
          on: {
            select_answer: {
              target: 'answering',
              actions: assign(({ context, event }) => {
                const correctIndex = context.correctIndices[context.currentActivityIndex]
                const correctAnswer = context.shuffledOptions[context.currentActivityIndex][correctIndex]
                const isCorrect = correctAnswer === event.answer
                
                return {
                  selectedAnswer: event.answer,
                  isCorrectAnswer: isCorrect,
                }
              }),
            },
            submit_answer: {
              target: 'processing',
              actions: assign(({ context }) => {
                const currentActivity = context.module.activities[context.currentActivityIndex]
                const isCorrect = context.isCorrectAnswer
                const timeSpent = Date.now() - context.currentQuestionStartTime
                
                return {
                  hits: isCorrect ? context.hits + 1 : context.hits,
                  mistakes: !isCorrect ? context.mistakes + 1 : context.mistakes,
                  answers: [
                    ...context.answers,
                    {
                      activityId: currentActivity.id,
                      selectedAnswer: context.selectedAnswer,
                      isCorrect,
                      timeSpent,
                    },
                  ],
                }
              }),
            },
          },
        },
        processing: {
          always: [
            {
              target: 'answered',
            },
          ],
        },
        answered: {
          on: {
            next_question: {
              target: 'next_question',
            },
          },
        },
        next_question: {
          always: [
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
    finished: {
      type: 'final',
      entry: assign(({ context }) => {
        const totalTime = Date.now() - context.startTime
        const correctAnswers = context.answers.filter(a => a.isCorrect).length
        
        return {
          timeSpent: totalTime,
          results: {
            totalQuestions: context.totalActivities,
            correctAnswers,
            incorrectAnswers: context.totalActivities - correctAnswers,
            totalTime,
            answers: context.answers,
            scorePercentage: Math.round((correctAnswers / context.totalActivities) * 100),
          },
        }
      }),
      on: {
        reset: {
          target: 'intro',
          actions: assign(({ context }) => createInitialContext(context.module, context.quizType)),
        },
      },
    },
  },
})

export default quizMachine
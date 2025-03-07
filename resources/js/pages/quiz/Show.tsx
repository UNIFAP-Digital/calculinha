import QuizLayout from '@/components/layouts/QuizLayout'
import { quizToast } from '@/components/quiz/QuizFeedback'
import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import gameMachine from '@/machines/gameMachine'
import { Module, Room } from '@/models'
import { httpPost } from '@/utils/api'
import { Head, usePage } from '@inertiajs/react'
import { useMachine } from '@xstate/react'
import '../../../css/quiz.css'

interface QuizShowPageProps {
  room: Room
  module: Module
}

export default function QuizShowPage({ room, module }: QuizShowPageProps) {
  const isStudent = usePage().props.auth.user?.type === 'student'
  const [state, send] = useMachine(gameMachine, { input: { module: { ...module, activities: module.activities ?? [] } } })
  const { selectedAnswer, module: gameModule, currentActivityIndex, hits, mistakes, correctAnswer, totalActivities } = state.context

  const handleSaveAnswer = async (activityId: number, answer: string) => {
    if (!isStudent) return

    await httpPost(route('api.quiz.store'), {
      activity_id: activityId,
      answer,
    })
  }

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === correctAnswer
    const message = isCorrect ? 'Resposta correta!' : 'Resposta incorreta!'

    send({ type: 'answer-selected', answer })

    /**
     * quizToast({
      message,
      type: isCorrect ? 'correct' : 'incorrect',
      button: {
        onClick: () => {
          handleSaveAnswer(gameModule.activities[currentActivityIndex].id, answer).finally(() => {
            send({ type: 'next-activity' })
          })
        },
      },
    })
     */
  }

  return (
    <QuizLayout>
      <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro module={gameModule} onStart={() => send({ type: 'start' })} />}
      {(state.matches('answering') || state.matches('answered')) && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={gameModule.activities[currentActivityIndex]}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          hits={hits}
          mistakes={mistakes}
          module={module}
          currentQuestionIndex={currentActivityIndex}
        />
      )}
      {state.matches('result') && (
        <QuizResult
          roomId={room.id}
          score={state.context.hits}
          totalActivities={state.context.totalActivities}
          startGameAgain={() => send({ type: 'reset' })}
        />
      )}
    </QuizLayout>
  )
}

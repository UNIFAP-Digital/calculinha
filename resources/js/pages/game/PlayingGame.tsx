import QuizLayout from '@/components/layouts/QuizLayout'
import { quizToast } from '@/components/quiz/QuizFeedback'
import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import { gameMachine } from '@/machines/gameMachine'
import { GameSelectPageProps } from '@/pages/game/GameSelect'
import { httpPost } from '@/utils/api'
import { Head, usePage } from '@inertiajs/react'
import { useMachine } from '@xstate/react'
import '../../../css/quiz.css'

export default function PlayingGame({ response }: GameSelectPageProps) {
  const isAuthenticated = !!usePage().props.auth.user
  const [state, send] = useMachine(gameMachine, { input: { module: response.modules[0] } })
  const { selectedAnswer, module, currentActivityIndex, hits, mistakes, correctAnswer, totalActivities } = state.context

  const handleSaveAnswer = async (moduleActivityId: number, answer: string) => {
    if (isAuthenticated) return

    await httpPost(route('quiz.result', response.id), {
      module_activity_id: moduleActivityId,
      answer,
    })
  }

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === correctAnswer
    const message = isCorrect ? 'Resposta correta!' : 'Resposta incorreta!'

    send({ type: 'answer-selected', answer })

    quizToast({
      message,
      type: isCorrect ? 'correct' : 'incorrect',
      button: {
        onClick: () => {
          handleSaveAnswer(module.activities[currentActivityIndex].id, answer).finally(() => {
            send({ type: 'next-activity' })
          })
        },
      },
    })
  }

  return (
    <QuizLayout>
      <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro module={state.context.module} onStart={() => send({ type: 'start' })} />}
      {(state.matches('answering') || state.matches('answered')) && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={module.activities[currentActivityIndex]}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          hits={hits}
          mistakes={mistakes}
        />
      )}
      {state.matches('result') && (
        <QuizResult
          roomId={response.id}
          score={state.context.score}
          totalActivities={state.context.totalActivities}
          startGameAgain={() => send({ type: 'reset' })}
        />
      )}
    </QuizLayout>
  )
}

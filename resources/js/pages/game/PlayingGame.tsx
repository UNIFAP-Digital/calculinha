import { quizToast } from '@/components/quiz/QuizFeedback'
import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import { gameMachine } from '@/machines/gameMachine'
import { GameSelectPageProps } from '@/pages/game/GameSelect'
import { httpPost } from '@/utils/api'
import { Head, usePage } from '@inertiajs/react'
import { useMachine } from '@xstate/react'

export default function PlayingGame({ response }: GameSelectPageProps) {
  const isAuthenticated = !!usePage().props.auth.user
  const [state, send] = useMachine(gameMachine, { input: { flow: response.flows[0] } })
  const { selectedAnswer, flow, currentActivityIndex, hits, mistakes, correctAnswer, totalActivities } = state.context

  const handleSaveAnswer = async (flowActivityId: number, answer: string) => {
    if (isAuthenticated) return

    await httpPost(route('quiz.result', response.id), {
      flow_activity_id: flowActivityId,
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
          handleSaveAnswer(flow.activities[currentActivityIndex].id, answer).finally(() => {
            send({ type: 'next-activity' })
          })
        },
      },
    })
  }

  return (
    <>
      <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro flow={state.context.flow} onStart={() => send({ type: 'start' })} />}
      {(state.matches('answering') || state.matches('answered')) && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={flow.activities[currentActivityIndex]}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          hits={hits}
          mistakes={mistakes}
        />
      )}
      {state.matches('result') && (
        <QuizResult score={state.context.score} totalActivities={state.context.totalActivities} startGameAgain={() => send({ type: 'reset' })} />
      )}
    </>
  )
}

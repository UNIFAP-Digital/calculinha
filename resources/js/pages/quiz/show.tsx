import QuizGame from '@/components/quiz/quiz-game'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import quizMachine, { QuizType } from '@/machines/quizMachine'
import { Activity, Module, Room } from '@/models'
import { Head, router } from '@inertiajs/react'
import { useMachine } from '@xstate/react'

interface QuizShowPageProps {
  room: Room
  module: Module & {
    activities: Activity[]
  }
  quizType?: QuizType
}

export default function QuizShowPage({
  room,
  module,
  quizType = 'practice',
}: QuizShowPageProps) {
  const [state, send] = useMachine(quizMachine, { input: { module, quizType } })

  const {
    module: gameModule,
    quizType: currentQuizType,
    feedbackMode,
    results,
  } = state.context

  const handleStartQuiz = () => {
    send({ type: 'start', quizType })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Head
          title={`${currentQuizType === 'pre-test' ? 'Pré-teste' : currentQuizType === 'post-test' ? 'Pós-teste' : 'Quiz'} - ${module.name}`}
        />

        {state.matches('intro') && (
          <QuizIntro
            module={gameModule}
            quizType={quizType}
            onStart={handleStartQuiz}
            feedbackMode={feedbackMode}
          />
        )}

        {state.matches('playing') && (
          <QuizGame state={state} send={send} module={module} room={room} />
        )}

        {state.matches('finished') && (
          <QuizResult
            results={results!}
            roomId={room.id}
            quizType={currentQuizType}
            onRestart={() => send({ type: 'reset' })}
            onExit={() => router.visit(route('student.room', room.id))}
          />
        )}
      </div>
    </div>
  )
}

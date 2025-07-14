import QuizGame from '@/components/quiz/quiz-game'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import quizMachine from '@/machines/quizMachine'
import { Activity, Module, Room } from '@/models'
import { Head, router, usePage } from '@inertiajs/react'
import { useMachine } from '@xstate/react'
import { useEffect } from 'react'


interface QuizShowPageProps {
  room: Room
  module: Module & {
    activities: Activity[]
  }
}

export default function QuizShowPage({ room, module }: QuizShowPageProps) {
  const isStudent = usePage().props.auth.user?.type === 'student'
  const [state, send] = useMachine(quizMachine, { input: { module } })
  const { 
    currentActivityIndex, 
    selectedAnswer, 
    isCorrectAnswer, 
    hits, 
    mistakes, 
    totalActivities,
    module: gameModule 
  } = state.context


  const handleCompleteQuiz = async () => {
    if (!isStudent || !state.matches('finished')) return;

    try {
      router.visit(route('student.room', room.id));
      console.log("Redirecionando para página de status da sala...");
    } catch (error) {
      console.error("Falha ao redirecionar:", error);
    }
  };

  useEffect(() => {
    if (state.matches('finished')) {
      handleCompleteQuiz();
    }
  }, [state.value]);


  const handleAnswerSelect = (answer: string) => {
    send({ type: 'select_answer', answer })
  }

  const handleNextQuestion = () => {
    send({ type: 'next_question' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro module={gameModule} onStart={() => send({ type: 'start' })} />}
      {state.matches('playing') && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={gameModule.activities[currentActivityIndex]}
          totalActivitiesCount={gameModule.activities.length}
          selectedAnswer={selectedAnswer}
          isCorrectAnswer={isCorrectAnswer}
          onSelectAnswer={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          hits={hits}
          mistakes={mistakes}
          module={module}
          currentQuestionIndex={currentActivityIndex}
          isAnswered={state.matches({ playing: 'answered' })}
          isLastQuestion={currentActivityIndex === totalActivities - 1}
        />
      )}
      {state.matches('finished') && (
        <QuizResult
          roomId={room.id}
          score={hits}
          totalActivities={totalActivities}
          startGameAgain={() => send({ type: 'reset' })}
        />
      )}
    </div>
  </div>
  )
}

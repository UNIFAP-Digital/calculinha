import QuizLayout from '@/components/layouts/QuizLayout'
import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import { gameMachine } from '@/machines/gameMachine'
import { Module, Room } from '@/models'
import { httpPost } from '@/utils/api'
import { Head, usePage } from '@inertiajs/react'
import { useMachine } from '@xstate/react'
import { useEffect } from 'react'


interface QuizShowPageProps {
  room: Room
  module: Module
}

export default function QuizShowPage({ room, module }: QuizShowPageProps) {
  const isStudent = usePage().props.auth.user?.type === 'student'
  const [state, send] = useMachine(gameMachine, { input: { module: { ...module, activities: module.activities ?? [] } } })
  const { selectedAnswer, module: gameModule, currentActivityIndex, hits, mistakes, correctAnswer, totalActivities } = state.context


  const handleCompleteQuiz = async () => {
    if (!isStudent || !state.matches('result')) return;

    try {
      await httpPost(route('api.quiz.complete'), {
        room_id: room.id,
        attempt_module_id: module.id,
        score: state.context.hits,
        total_activities: state.context.totalActivities,
      });
      console.log("Sinal de conclusão enviado com sucesso para o servidor.");
    } catch (error) {
      console.error("Falha ao enviar sinal de conclusão do quiz:", error);
    }
  };

  useEffect(() => {
    if (state.matches('result')) {
      handleCompleteQuiz();
    }
  }, [state.value]);


  const handleAnswerSelect = (answer: string) => {
    send({ type: 'answer-selected', answer })

  }

  const handleNextActivity = () => {
    send({ type: 'next-activity' })
  }

  return (
    <QuizLayout>
      <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro module={gameModule} onStart={() => send({ type: 'start' })} />}
      {state.matches('playing') && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={gameModule.activities[currentActivityIndex]}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          hits={hits}
          mistakes={mistakes}
          module={module}
          currentQuestionIndex={currentActivityIndex}
          handleNextActivity={handleNextActivity}
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

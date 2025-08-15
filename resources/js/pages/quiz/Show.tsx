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
  const { selectedAnswer, module: gameModule, currentActivityIndex, hits, mistakes, correctAnswer, totalActivities, isCorrectAnswer } = state.context


  const handleCompleteQuiz = async () => {
    if (!isStudent || !state.matches('result')) return;

    try {
      await httpPost(route('quiz.complete'), {
        room_id: room.id,
        attempt_module_id: module.id,
        score: state.context.hits,
        total_activities: state.context.totalActivities,
        answers: state.context.answers,
      });
    } catch (error) {
      console.error("Falha ao enviar sinal de conclusão do quiz:", error);
    }
  };

  useEffect(() => {
    if (state.matches('result')) {
      handleCompleteQuiz();
    }
  }, [state.value]);


  const handleCommitAnswer = (answer: string) => {
    send({ type: 'commitAnswer', answer }) 
  }

  const handleNextActivity = () => {
    send({ type: 'nextActivity' }) 
  }

  return (
    <QuizLayout>
      <Head title="Quiz" />

      {state.matches('intro') && <QuizIntro module={gameModule} onStart={() => send({ type: 'start' })} />}
      {state.matches('playing') && (
        <QuizGame
          progress={`${currentActivityIndex + 1}/${totalActivities}`}
          activity={gameModule.activities[currentActivityIndex]}
          selectedAnswer={selectedAnswer} // From machine context
          isCorrectAnswer={isCorrectAnswer} // From machine context
          onCommitAnswer={handleCommitAnswer}
          module={module}
          currentQuestionIndex={currentActivityIndex}
          handleNextActivity={handleNextActivity}
          score={hits} // Pass hits from machine context
        />
      )}
      {state.matches('result') && (
        <QuizResult
          module={module}
          roomId={room.id}
          score={state.context.hits}
          totalActivities={state.context.totalActivities}
          startGameAgain={() => send({ type: 'reset' })}
        />
      )}
    </QuizLayout>
  )
}

import { useGameMachine } from '@/machines/gameMachine'
import Participant from '@/models/participant'
import Room from '@/models/room'
import { Head, usePage } from '@inertiajs/react'
import { useEffect } from 'react'

interface GameManagementPageProps {
  room: Room
  participant: Participant | null
  completed_flows: number[]
}

export default function GameManagementPage({ room, completed_flows }: GameManagementPageProps) {
  const user = usePage().props.auth.user
  const isAuthenticated = user !== null

  const { gameState, setFlows, setFlow } = useGameMachine(isAuthenticated)

  // Inicializar flows quando o componente for montado
  useEffect(() => {
    setFlows(room.flows || [])

    if (room.flows?.length === 1) {
      setFlow(room.flows[0].id)
    }
  }, [room.flows])

  return (
    <>
      <Head title="Quiz" />

      {gameState === 'Idle' && room.flows && room.flows.length > 0 && <QuizSelect />}

      {/*{gameState === 'playing' && currentActivity && (*/}
      {/*  <QuizGame*/}
      {/*    activity={currentActivity}*/}
      {/*    selectedAnswer={selectedAnswer}*/}
      {/*    onAnswerSelect={handleAnswerSelect}*/}
      {/*    onNext={nextActivity}*/}
      {/*    primaryColor={theme.primaryColor}*/}
      {/*  />*/}
      {/*)}*/}

      {/*{gameState === 'answered' && currentActivity && (*/}
      {/*  <QuizGame*/}
      {/*    activity={currentActivity}*/}
      {/*    selectedAnswer={selectedAnswer}*/}
      {/*    onAnswerSelect={handleAnswerSelect}*/}
      {/*    onNext={nextActivity}*/}
      {/*    showResult*/}
      {/*    isCorrect={selectedAnswer === currentActivity.activity?.correct_answer}*/}
      {/*    primaryColor={theme.primaryColor}*/}
      {/*  />*/}
      {/*)}*/}

      {/*{gameState === 'finished' && currentFlow && (*/}
      {/*  <QuizResult*/}
      {/*    roomId={currentFlow.room_id}*/}
      {/*    primaryColor={theme.primaryColor}*/}
      {/*    score={score}*/}
      {/*    totalQuestions={totalActivities}*/}
      {/*    answers={answers}*/}
      {/*    onReset={resetQuiz}*/}
      {/*  />*/}
      {/*)}*/}

      {/*{gameState === 'no_flow' && (*/}
      {/*  <div className="flex min-h-screen items-center justify-center">*/}
      {/*    <div className="rounded-lg p-8 text-center">*/}
      {/*      <h1 className="mb-4 text-2xl font-bold">Nenhum quiz disponível</h1>*/}
      {/*      <p>Não há quizzes disponíveis nesta sala no momento.</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  )
}

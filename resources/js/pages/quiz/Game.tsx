import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import { QuizAnswer, QuizProvider } from '@/contexts/QuizContext'
import { Flow } from '@/models/flow'
import { httpPost } from '@/utils/api'
import { generateColorScheme } from '@/utils/color'
import { Head, usePage } from '@inertiajs/react'
import { toast } from 'sonner'

interface GamePageProps {
  flow: Flow
}

export default function GamePage({ flow }: GamePageProps) {
  const user = usePage().props.auth.user
  const theme = generateColorScheme(flow.color)

  const handleQuizComplete = async (score: number, answers: QuizAnswer[]) => {
    if (user != null) return

    try {
      const attempts = answers.map((answer) => ({
        flow_activity_id: answer.flowActivityId,
        answer: answer.answer,
      }))

      await httpPost(route('quiz.result', flow.room_id), { attempts })

      toast('Resultados enviados', {
        description: `Sua pontuação: ${score} de ${flow.flow_activities?.length}`,
      })
    } catch {
      toast('Erro ao enviar resultados', {
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <>
      <Head title="Quiz" />
      <QuizProvider flowActivities={flow.flow_activities!} onComplete={handleQuizComplete}>
        <QuizIntro flow={flow} primaryColor={theme.primaryColor} textColor={theme.textColor} />
        <QuizGame />
        <QuizResult roomId={flow.room_id} primaryColor={theme.primaryColor} />
      </QuizProvider>
    </>
  )
}

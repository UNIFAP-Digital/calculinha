import QuizGame from '@/components/quiz/QuizGame'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizResult from '@/components/quiz/QuizResult'
import { QuizProvider } from '@/contexts/QuizContext'
import { Flow } from '@/models/flow'
import { generateColorScheme } from '@/utils/color'
import { Head } from '@inertiajs/react'

interface GamePageProps {
  flow: Flow
}

export default function GamePage({ flow }: GamePageProps) {
  const theme = generateColorScheme(flow.color)

  return (
    <>
      <Head title="Quiz" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <QuizProvider flowActivities={flow.flow_activities!}>
          <QuizIntro flow={flow} primaryColor={theme.primaryColor} textColor={theme.textColor} />
          <QuizGame primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor} />
          <QuizResult primaryColor={theme.primaryColor} />
        </QuizProvider>
      </div>
    </>
  )
}

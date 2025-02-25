import QuizButton from '@/components/quiz/QuizButton'
import QuizCard from '@/components/quiz/QuizCard'
import { useQuiz } from '@/contexts/QuizContext'
import { Flow } from '@/models/flow'
import { motion } from 'framer-motion'

interface QuizIntroProps {
  flow: Flow
  primaryColor: string
  textColor: string
}

export default function QuizIntro({ flow, primaryColor, textColor }: QuizIntroProps) {
  const { gameState, startGame } = useQuiz()

  if (gameState !== 'start') return null

  return (
    <QuizCard
      title={flow.name}
      backgroundColor={primaryColor}
      animation={{
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex size-24 items-center justify-center rounded-full bg-white p-6">
          <span className="text-[30px]">{flow.icon}</span>
        </motion.div>
        <p className="text-center text-xl text-white">{flow.description}</p>
        <QuizButton onClick={startGame} color={textColor} textColor={primaryColor} hoverColor="#E5E5E5" className="px-8 py-6 text-lg">
          Começar Quiz!
        </QuizButton>
      </div>
    </QuizCard>
  )
}

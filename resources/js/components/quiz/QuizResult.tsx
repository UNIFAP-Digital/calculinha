import QuizButton from '@/components/quiz/QuizButton'
import QuizCard from '@/components/quiz/QuizCard'
import { useQuiz } from '@/contexts/QuizContext'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface QuizResultProps {
  primaryColor: string
  roomId: number
}

export default function QuizResult({ primaryColor, roomId }: QuizResultProps) {
  const { gameState, score, totalActivities, startGame } = useQuiz()

  if (gameState !== 'finished') return null

  return (
    <QuizCard
      title="Quiz Concluído! 🏆"
      backgroundColor={primaryColor}
      animation={{
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Trophy size={100} className="text-[#FFD700]" />
        </motion.div>
        <p className="text-2xl font-bold text-white">Sua Pontuação:</p>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-5xl font-extrabold text-white"
        >
          {score} / {totalActivities}
        </motion.p>
        <QuizButton onClick={startGame} color="white" textColor={primaryColor} hoverColor="#E5E5E5" className="px-8 py-6 text-lg">
          Jogar Novamente
        </QuizButton>
        <Link href={route('quiz.index', roomId)}>
          <QuizButton onClick={startGame} color="white" textColor={primaryColor} hoverColor="#E5E5E5" className="px-8 py-6 text-lg">
            Voltar à sala
          </QuizButton>
        </Link>
      </div>
    </QuizCard>
  )
}

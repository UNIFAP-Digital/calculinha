import { Card, CardContent } from '@/components/ui/card'
import { useShakeAnimation } from '@/hooks/useShakeAnimation'
import { cn } from '@/utils/ui'
import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { SyntheticEvent } from 'react'

const FEEDBACK_COLORS = {
  correct: '#4CAF50',
  incorrect: '#F44336',
} as const

const optionColorStyles = [
  'from-orange-500 to-orange-400 hover:shadow-orange-500/50 border-orange-300 active:from-orange-600 active:to-orange-500 shadow-orange-700/50',
  'from-teal-500 to-teal-400 hover:shadow-teal-500/50 border-teal-300 active:from-teal-600 active:to-teal-500 shadow-teal-700/50',
  'from-indigo-500 to-indigo-400 hover:shadow-indigo-500/50 border-indigo-300 active:from-indigo-600 active:to-indigo-500 shadow-indigo-700/50',
  'from-pink-500 to-pink-400 hover:shadow-pink-500/50 border-pink-300 active:from-pink-600 active:to-pink-500 shadow-pink-700/50',
]

interface OptionCardProps {
  option: {
    id: string
    text: string
  }
  index: number
  correctIndex: number
  selectedAnswer: number | null
  onClick: () => void
}

const MotionCard = motion.create(Card)

const solidColorMap = [
  '#f97316', // orange-500
  '#a855f7', // purple-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
]

const gradientMap = [
  'linear-gradient(to bottom right, #f97316, #fb923c)', // orange gradient
  'linear-gradient(to bottom right, #14b8a6, #2dd4bf)', // teal gradient
  'linear-gradient(to bottom right, #6366f1, #818cf8)', // indigo gradient
  'linear-gradient(to bottom right, #ec4899, #f472b6)', // pink gradient
]

export function QuizOptionCard(props: OptionCardProps) {
  const { scope, shake } = useShakeAnimation()
  const { index, option, onClick, correctIndex, selectedAnswer } = props

  const isCorrectAnswer = correctIndex === index
  const isSelected = selectedAnswer === index
  const isAnswered = selectedAnswer !== null

  const shouldShow = isAnswered ? isSelected || isCorrectAnswer : true

  const handleOnClick = async (e: SyntheticEvent) => {
    onClick()

    if (isCorrectAnswer) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      await confetti({
        spread: 40,
        particleCount: 25,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      })
    } else {
      shake()
    }
  }

  const getBackgroundStyle = () => {
    if (!isAnswered) {
      return gradientMap[index]
    }
    if (isCorrectAnswer) {
      return `linear-gradient(to bottom right, ${FEEDBACK_COLORS.correct}, ${FEEDBACK_COLORS.correct})`
    } else if (isSelected) {
      return `linear-gradient(to bottom right, ${FEEDBACK_COLORS.incorrect}, ${FEEDBACK_COLORS.incorrect})`
    }
    return gradientMap[index]
  }

    const transition = {
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
    }

  return (
    <MotionCard
      key={option.id}
      initial={{ opacity: 0, y: 10, backgroundColor: solidColorMap[index] }}
      animate={{
        opacity: shouldShow ? 1 : 0,
        y: 0,

        backgroundImage: getBackgroundStyle(),
        transition: {
          backgroundColor: { duration: 0.2 },
        },
      }}
      ref={scope}
      exit={{ opacity: 0 }}
      layout
      className={cn(
        'relative flex flex-1 cursor-pointer rounded-xl border-2 bg-gradient-to-br text-white shadow-[0_8px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 ease-in-out active:translate-y-2 active:shadow-[0_4px_0_0_rgba(0,0,0,0.3)]',
        {
          [optionColorStyles[index]]: true,
          'pointer-events-none': isAnswered,
        },
      )}
      onClick={handleOnClick}
    >
      <CardContent className="flex h-full w-full items-center justify-center py-0">
        <h2 className="text-center text-lg font-bold tracking-wider select-none sm:text-4xl">{option.text}</h2>
      </CardContent>
    </MotionCard>
  )
}

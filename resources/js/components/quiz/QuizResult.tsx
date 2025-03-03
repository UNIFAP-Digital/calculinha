import { Link } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Award, BookOpen, Home, RotateCcw, Star, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Level = 'excellent' | 'good' | 'average' | 'needsImprovement'

const THEMES = {
  excellent: {
    background: 'bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-900',
    card: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20',
    button: 'bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600',
    accent: 'text-pink-300',
    progress: ['#e879f9', '#a855f7'],
    icon: '#e879f9',
  },
  good: {
    background: 'bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900',
    card: 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    button: 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600',
    accent: 'text-cyan-300',
    progress: ['#38bdf8', '#3b82f6'],
    icon: '#38bdf8',
  },
  average: {
    background: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900',
    card: 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    button: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
    accent: 'text-emerald-300',
    progress: ['#4ade80', '#10b981'],
    icon: '#4ade80',
  },
  needsImprovement: {
    background: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900',
    card: 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20',
    button: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600',
    accent: 'text-gray-300',
    progress: ['#9ca3af', '#6b7280'],
    icon: '#9ca3af',
  },
}

// Simplified feedback messages
const FEEDBACK_MESSAGES = {
  excellent: ['Incrível! Você é um verdadeiro gênio! 🌟', 'Uau! Você dominou este desafio! 🎯', 'Extraordinário! Seu esforço valeu a pena! 🏆'],
  good: ['Muito bom! Você está aprendendo rápido! ⭐', 'Parabéns! Continue praticando assim! 🎊', 'Ótimo trabalho! Você está no caminho certo! 🚀'],
  average: ['Bom trabalho! Continue se esforçando! 💫', 'Você está progredindo! Continue assim! 🌱', 'Cada tentativa te deixa mais forte! 🌈'],
  needsImprovement: [
    'Você consegue! Vamos praticar mais um pouco! ✨',
    'Continue tentando! Cada desafio te ensina algo novo! 🔆',
    'Não desista! A persistência é a chave do sucesso! 💪',
  ],
}

// Simplified progress bar component
const ProgressBar = ({ percentage, colors }: { percentage: number; colors: string[] }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-white/80">Progresso</span>
        <span className="text-sm font-bold text-white">{percentage.toFixed(0)}%</span>
      </div>
      <div className="relative h-7 w-full overmodule-hidden rounded-full bg-white/20">
        <motion.div
          className="absolute h-full rounded-full border border-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
            boxShadow: 'inset 0px 2px 4px rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
              repeatDelay: 0.5,
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

type ScoreCounterProps = {
  score: number
  onComplete: () => void
  duration?: number
}
const ScoreCounter = ({ score, duration = 1.5, onComplete }: ScoreCounterProps) => {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (score === 0) {
      if (onComplete) onComplete()
      return
    }

    const interval = setInterval(
      () => {
        setDisplayScore((prev) => {
          const next = prev + 1
          if (next >= score) {
            clearInterval(interval)
            if (onComplete) onComplete()
            return score
          }
          return next
        })
      },
      (duration * 1000) / score,
    )

    return () => clearInterval(interval)
  }, [score, duration, onComplete])

  return (
    <motion.span
      className="text-7xl font-bold"
      initial={{ scale: 0.9 }}
      animate={{
        scale: displayScore === score ? [1, 1.1, 1] : 1,
        color: displayScore === score ? ['#f8fafc', '#fef08a'] : '#f8fafc',
      }}
      transition={{ duration: 0.3 }}
    >
      {displayScore}
    </motion.span>
  )
}

// Background elements simplified
const BackgroundElements = () => {
  const elements = ['+', '-', '×', '÷', '=', '123', '?', '!']

  return (
    <div className="absolute inset-0 overmodule-hidden">
      {elements.map((el, index) => (
        <motion.div
          key={index}
          className="absolute text-5xl text-white/10 select-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.9, 1, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 10 + Math.random() * 5,
            ease: 'easeInOut',
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
        >
          {el}
        </motion.div>
      ))}
    </div>
  )
}

// Performance decorations - only for excellent and good
const PerformanceDecorations = ({ level }: { level: Level }) => {
  if (level !== 'excellent' && level !== 'good') return null

  const count = level === 'excellent' ? 8 : 5
  const color = level === 'excellent' ? 'fill-pink-300 text-pink-300' : 'fill-cyan-300 text-cyan-300'

  return (
    <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1 + i * 0.1,
            duration: 0.5,
          }}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Star className={`h-6 w-6 ${color} drop-shadow-lg`} />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Result icon based on performance
const ResultIcon = ({ level, iconColor }: { level: Level; iconColor: string }) => {
  let Icon
  let size

  switch (level) {
    case 'excellent':
      Icon = Trophy
      size = 'h-28 w-28'
      break
    case 'good':
      Icon = Award
      size = 'h-24 w-24'
      break
    case 'average':
      Icon = Star
      size = 'h-20 w-20'
      break
    default:
      Icon = BookOpen
      size = 'h-20 w-20'
  }

  return (
    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{ color: iconColor }}
        className={`${size} drop-shadow-lg`}
      >
        <Icon />
      </motion.div>
    </motion.div>
  )
}

interface QuizResultProps {
  roomId: number
  score: number
  totalActivities: number
  startGameAgain: () => void
}

export default function QuizResult({ roomId, score, totalActivities, startGameAgain }: QuizResultProps) {
  const [, setAnimationComplete] = useState(false)

  // Calculate score percentage
  const percentageScore = useMemo(() => {
    const validScore = Math.max(0, Math.min(score, totalActivities))
    return totalActivities > 0 ? (validScore / totalActivities) * 100 : 0
  }, [score, totalActivities])

  // Determine performance level
  const performanceLevel = useMemo(() => {
    if (percentageScore >= 90) return 'excellent'
    if (percentageScore >= 70) return 'good'
    if (percentageScore >= 40) return 'average'
    return 'needsImprovement'
  }, [percentageScore])

  // Get theme for current performance level
  const theme = THEMES[performanceLevel]

  // Get random feedback message
  const feedbackMessage = useMemo(() => {
    const messages = FEEDBACK_MESSAGES[performanceLevel]
    return messages[Math.floor(Math.random() * messages.length)]
  }, [performanceLevel])

  // Confetti effect - only for good and excellent
  const launchConfetti = () => {
    if (performanceLevel === 'needsImprovement' || performanceLevel === 'average') return

    const colors = ['#f472b6', '#a855f7', '#38bdf8', '#4ade80']
    const particleCount = performanceLevel === 'excellent' ? 120 : 80

    confetti({
      particleCount,
      spread: 80,
      origin: { y: 0.5, x: 0.5 },
      colors,
      startVelocity: 30,
      gravity: 0.7,
      zIndex: 1000,
    })

    if (performanceLevel === 'excellent') {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 135,
          spread: 50,
          origin: { x: 0, y: 0.6 },
          colors,
        })

        confetti({
          particleCount: 30,
          angle: 45,
          spread: 50,
          origin: { x: 1, y: 0.6 },
          colors,
        })
      }, 700)
    }
  }

  return (
    <div className={`fixed inset-0 ${theme.background} z-50 flex flex-col items-center justify-center overmodule-hidden`}>
      {/* Background elements */}
      <BackgroundElements />

      {/* Performance decorations */}
      <PerformanceDecorations level={performanceLevel} />

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title with animated underline */}
        <motion.div className="relative mb-8 text-center">
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Quiz Concluído!
          </motion.h1>
          <motion.div
            className={`mx-auto mt-3 h-1 rounded-full ${theme.accent}`}
            initial={{ width: 0 }}
            animate={{ width: '12rem' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>

        {/* Result icon */}
        <ResultIcon level={performanceLevel} iconColor={theme.icon} />

        {/* Feedback message */}
        <motion.h2
          className={`mb-8 text-center text-2xl font-semibold ${theme.accent} drop-shadow-lg`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {feedbackMessage}
        </motion.h2>

        {/* Score card */}
        <motion.div
          className={`mb-10 w-full max-w-2xl rounded-xl border border-white/20 ${theme.card} px-8 py-6 shadow-lg backdrop-blur-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <p className="mb-4 text-xl font-medium text-white">Sua Pontuação:</p>
            <div className="mb-6 flex items-center justify-center gap-3">
              <ScoreCounter
                score={score}
                onComplete={() => {
                  setAnimationComplete(true)
                  launchConfetti()
                }}
              />
              <span className="text-4xl font-medium text-white/80">/</span>
              <span className="text-4xl font-medium text-white/80">{totalActivities}</span>
            </div>

            {/* Progress bar */}
            <ProgressBar percentage={percentageScore} colors={theme.progress} />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="grid w-full max-w-2xl grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}>
            <button onClick={startGameAgain} className={`h-14 w-full rounded-xl border border-white/20 ${theme.button} font-semibold text-white shadow-md`}>
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>Jogar Novamente</span>
              </div>
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link href={route('quiz.index', roomId)} className="block h-full">
              <button className={`h-14 w-full rounded-xl border border-white/20 ${theme.button} font-semibold text-white shadow-md`}>
                <div className="flex items-center justify-center gap-2">
                  <Home className="h-5 w-5" />
                  <span>Voltar à Sala</span>
                </div>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

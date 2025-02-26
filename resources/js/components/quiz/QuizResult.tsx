import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useQuiz } from '@/contexts/QuizContext'
import { Link } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Home, RotateCcw, Share2, Sparkles, Star, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

// Gradientes para diferentes níveis de desempenho
const performanceGradients = {
  excellent: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
  good: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
  average: 'bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500',
  needsImprovement: 'bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500',
}

// Mensagens personalizadas baseadas no desempenho
const feedbackMessages = {
  excellent: ['INCRÍVEL! Você é um gênio da matemática! 🤩', 'UAU! Você arrasou totalmente! 🎯', 'FENOMENAL! Você é um verdadeiro campeão! 🏆'],
  good: ['MUITO BOM! Você está mandando super bem! ⭐', 'PARABÉNS! Seu esforço está valendo a pena! 🎉', 'FANTÁSTICO! Continue praticando assim! 🌟'],
  average: ['BOM TRABALHO! Você está no caminho certo! 👍', 'LEGAL! Continue praticando para melhorar! 💪', 'MUITO BEM! Cada vez você vai ficar melhor! 🌈'],
  needsImprovement: [
    'VOCÊ CONSEGUE! Vamos praticar mais um pouco! 💫',
    'CONTINUE TENTANDO! A prática leva à perfeição! 🌱',
    'NÃO DESISTA! Cada desafio te deixa mais forte! 🚀',
  ],
}

interface QuizResultProps {
  primaryColor?: string
  roomId?: number
}

export default function QuizResult({ primaryColor = '#6366f1', roomId = 1 }: QuizResultProps) {
  const { gameState, score, totalActivities, startGame } = useQuiz()
  const [countedScore, setCountedScore] = useState(0)
  const [progress, setProgress] = useState(0)

  // Calcular porcentagem de acerto
  const percentageScore = (score / totalActivities) * 100

  // Determinar o nível de desempenho
  const getPerformanceLevel = () => {
    if (percentageScore >= 90) return 'excellent'
    if (percentageScore >= 70) return 'good'
    if (percentageScore >= 40) return 'average'
    return 'needsImprovement'
  }

  const performanceLevel = getPerformanceLevel()

  // Selecionar mensagem aleatória com base no desempenho
  const getFeedbackMessage = () => {
    const messages = feedbackMessages[performanceLevel]
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex]
  }

  // Efeitos de confetti baseados no desempenho
  useEffect(() => {
    if (gameState !== 'finished') return

    // Função para lançar confetti
    const launchConfetti = () => {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const colors = ['#FFC700', '#FF0000', '#2E3191', '#41D0D1', '#FF4F79']

      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min
      }

      const frame = () => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) return

        // Quantidade de confetti baseada no desempenho
        const particleCount = performanceLevel === 'excellent' ? 7 : performanceLevel === 'good' ? 5 : performanceLevel === 'average' ? 3 : 2

        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 90),
          origin: { y: 0.7 },
          colors: colors,
          zIndex: 1000,
        })

        // Próximo frame
        requestAnimationFrame(frame)
      }

      frame()
    }

    // Animação de contador para o score
    const animateScore = () => {
      const duration = 2000 // 2 segundos
      const framesPerSecond = 60
      const totalFrames = (duration / 1000) * framesPerSecond
      const increment = score / totalFrames

      let currentCount = 0
      let currentFrame = 0

      const countInterval = setInterval(() => {
        currentFrame++
        currentCount = Math.min(currentCount + increment, score)
        setCountedScore(Math.floor(currentCount))
        setProgress((currentCount / totalActivities) * 100)

        if (currentFrame >= totalFrames) {
          clearInterval(countInterval)
          setCountedScore(score)
          setProgress((score / totalActivities) * 100)

          // Lançar confetti após a contagem terminar
          if (percentageScore >= 40) {
            launchConfetti()
          }
        }
      }, 1000 / framesPerSecond)

      return () => clearInterval(countInterval)
    }

    animateScore()
  }, [gameState, score, totalActivities, percentageScore, performanceLevel])

  if (gameState !== 'finished') return null

  // Elementos flutuantes animados (números, símbolos)
  const FloatingElements = () => {
    const elements = [
      { content: '+', size: 'text-5xl', color: 'text-white/15' },
      { content: '-', size: 'text-6xl', color: 'text-white/20' },
      { content: '×', size: 'text-7xl', color: 'text-white/15' },
      { content: '÷', size: 'text-5xl', color: 'text-white/20' },
      { content: '=', size: 'text-6xl', color: 'text-white/15' },
      { content: '123', size: 'text-4xl', color: 'text-white/20' },
      { content: <Star className="h-16 w-16" />, size: '', color: 'text-yellow-300/30' },
      { content: <Sparkles className="h-12 w-12" />, size: '', color: 'text-yellow-200/30' },
      { content: '?', size: 'text-6xl', color: 'text-white/15' },
      { content: '!', size: 'text-7xl', color: 'text-white/20' },
    ]

    return (
      <>
        {elements.map((el, index) => {
          // Pré-calcular valores aleatórios que serão usados na animação
          const xPos = `${Math.random() * 90}%`
          const yPos = `${Math.random() * 90}%`
          const xMovements = [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50]
          const yMovements = [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50]
          const rotations = [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10]
          const duration = 20 + Math.random() * 10

          return (
            <motion.div
              key={index}
              className={`absolute ${el.size} ${el.color} select-none`}
              initial={{
                x: xMovements[0],
                y: yMovements[0],
                opacity: 0,
                rotate: rotations[0],
              }}
              animate={{
                x: xMovements,
                y: yMovements,
                opacity: [0.1, 0.3, 0.1],
                rotate: rotations,
              }}
              transition={{
                repeat: Infinity,
                duration: duration,
                ease: 'linear',
              }}
              style={{
                left: xPos,
                top: yPos,
                zIndex: 0,
              }}
            >
              {el.content}
            </motion.div>
          )
        })}
      </>
    )
  }

  // Decorações baseadas no desempenho
  const PerformanceDecorations = () => {
    if (performanceLevel === 'excellent') {
      return (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
          {/* Estrelas para desempenho excelente */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 180,
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [0.8, 1.2, 0.8],
                rotate: `${Math.random() * 360}deg`,
              }}
              transition={{
                delay: 2.5 + i * 0.1,
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                zIndex: 10,
              }}
            >
              <Star className="h-8 w-8 fill-yellow-300 text-yellow-300" />
            </motion.div>
          ))}
        </motion.div>
      )
    }

    if (performanceLevel === 'good') {
      return (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
          {/* Símbolos de brilho para bom desempenho */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                delay: 2.5 + i * 0.1,
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                zIndex: 10,
              }}
            >
              <Sparkles className="h-6 w-6 text-blue-300" />
            </motion.div>
          ))}
        </motion.div>
      )
    }

    return null
  }

  // Troféu animado para excelentes desempenhos
  const AnimatedTrophy = () => {
    if (performanceLevel === 'excellent' || performanceLevel === 'good') {
      return (
        <motion.div
          className="mb-6"
          initial={{ scale: 0, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{
            delay: 2.2,
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {performanceLevel === 'excellent' ? (
              <Trophy className="h-32 w-32 text-yellow-400 drop-shadow-lg" />
            ) : (
              <Award className="h-28 w-28 text-yellow-400 drop-shadow-lg" />
            )}
          </motion.div>
        </motion.div>
      )
    }

    if (performanceLevel === 'average') {
      return (
        <motion.div
          className="mb-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 2.2,
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 3, 0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Star className="h-24 w-24 text-yellow-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      )
    }

    return (
      <motion.div
        className="mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 2.2,
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        <motion.div
          animate={{
            y: [0, -3, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Sparkles className="h-20 w-20 text-blue-400 drop-shadow-lg" />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 ${performanceGradients[performanceLevel]} z-50 flex flex-col items-center justify-center overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElements />
        </div>

        {/* Decorative elements based on performance */}
        <PerformanceDecorations />

        {/* Main Content */}
        <motion.div
          className="relative z-10 flex w-full max-w-xl flex-col items-center justify-center px-6 py-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title with animated underline */}
          <motion.div className="relative mb-6" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-center text-5xl font-extrabold tracking-wide text-white drop-shadow-lg">QUIZ CONCLUÍDO!</h1>
            <motion.div
              className="mt-1 h-2 rounded-full bg-white/70"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          {/* Trophy or Award based on performance */}
          <AnimatedTrophy />

          {/* Message */}
          <motion.div className="mb-8 px-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
            <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">{getFeedbackMessage()}</h2>
          </motion.div>

          {/* Score Display */}
          <motion.div
            className="mb-6 w-full rounded-xl border border-white/30 bg-white/20 px-6 py-4 shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <p className="mb-2 text-xl font-semibold text-white">Sua Pontuação:</p>
              <div className="mb-4 flex items-center justify-center gap-2">
                <motion.span
                  className="text-7xl font-black text-white"
                  animate={{
                    scale: [1, 1.2, 1],
                    textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {countedScore}
                </motion.span>
                <span className="text-4xl font-bold text-white/80">/</span>
                <span className="text-4xl font-bold text-white/80">{totalActivities}</span>
              </div>

              <div className="w-full px-2">
                <Progress value={progress} className="h-4 bg-white/30" />
                <motion.div
                  className="absolute top-0 left-0 h-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ delay: 2, duration: 1.5, repeat: 3 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="grid w-full max-w-md grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Button
              onClick={startGame}
              className="rounded-xl bg-white py-6 text-lg font-bold shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_10px_0_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-[0_4px_0_0_rgba(0,0,0,0.1)]"
              style={{ color: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>Jogar Novamente</span>
              </div>
            </Button>

            <Link href={route('quiz.index', roomId)} className="block">
              <Button
                className="w-full rounded-xl bg-white py-6 text-lg font-bold shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_10px_0_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-[0_4px_0_0_rgba(0,0,0,0.1)]"
                style={{ color: primaryColor }}
              >
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span>Voltar à Sala</span>
                </div>
              </Button>
            </Link>
          </motion.div>


        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

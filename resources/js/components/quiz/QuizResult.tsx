import { Link } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, BookOpen, Home, RotateCcw, Sparkles, Star, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

// Background gradientes mais suaves e refinados
const backgroundGradients = {
  excellent: 'bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-900',
  good: 'bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900',
  average: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900',
  needsImprovement: 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700',
}

// Card gradientes - cores complementares aos backgrounds
const cardGradients = {
  excellent: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20',
  good: 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
  average: 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
  needsImprovement: 'bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20',
}

// Gradientes para os botões, com cores complementares
const buttonGradients = {
  excellent: 'bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 border border-white/20 shadow-md shadow-purple-900/30',
  good: 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border border-white/20 shadow-md shadow-blue-900/30',
  average: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-white/20 shadow-md shadow-teal-900/30',
  needsImprovement:
    'bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 border border-white/20 shadow-md shadow-amber-900/30',
}

// Gradientes para a barra de progresso
const progressGradients = {
  excellent: 'linear-gradient(90deg, rgba(232, 121, 249, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
  good: 'linear-gradient(90deg, rgba(56, 189, 248, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%)',
  average: 'linear-gradient(90deg, rgba(74, 222, 128, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
  needsImprovement: 'linear-gradient(90deg, rgba(250, 204, 21, 0.9) 0%, rgba(251, 146, 60, 0.9) 100%)', // Amarelo para laranja, sem vermelho
}

// Cores para os ícones - mais luminosas para contraste
const iconColors = {
  excellent: '#e879f9', // Rosa vibrante
  good: '#38bdf8', // Azul céu vibrante
  average: '#4ade80', // Verde vibrante
  needsImprovement: '#fbbf24', // Amarelo vibrante
}

// Cores de destaque complementares para cada nível
const accentColors = {
  excellent: 'text-pink-300',
  good: 'text-cyan-300',
  average: 'text-emerald-300',
  needsImprovement: 'text-yellow-300',
}

// Mensagens de feedback inspiradoras e encorajadoras
const feedbackMessages = {
  excellent: ['Incrível! Você é um verdadeiro gênio! 🌟', 'Uau! Você dominou este desafio! 🎯', 'Extraordinário! Seu esforço valeu a pena! 🏆'],
  good: ['Muito bom! Você está aprendendo rápido! ⭐', 'Parabéns! Continue praticando assim! 🎊', 'Ótimo trabalho! Você está no caminho certo! 🚀'],
  average: ['Bom trabalho! Continue se esforçando! 💫', 'Você está progredindo! Continue assim! 🌱', 'Cada tentativa te deixa mais forte! 🌈'],
  needsImprovement: [
    'Você consegue! Vamos praticar mais um pouco! ✨',
    'Continue tentando! Cada desafio te ensina algo novo! 🔆',
    'Não desista! A persistência é a chave do sucesso! 💪',
  ],
}

// Elementos flutuantes para o background - utilizando símbolos matemáticos e elementos decorativos
const floatingElementsData = [
  { content: '+', size: 'text-5xl', color: 'text-white/10' },
  { content: '-', size: 'text-5xl', color: 'text-white/10' },
  { content: '×', size: 'text-5xl', color: 'text-white/10' },
  { content: '÷', size: 'text-5xl', color: 'text-white/10' },
  { content: '=', size: 'text-5xl', color: 'text-white/10' },
  { content: '123', size: 'text-4xl', color: 'text-white/10' },
  { content: <BookOpen className="h-16 w-16" />, size: '', color: 'text-white/10' },
  { content: <Star className="h-16 w-16" />, size: '', color: 'text-white/10' },
  { content: <Sparkles className="h-16 w-16" />, size: '', color: 'text-white/10' },
  { content: '?', size: 'text-5xl', color: 'text-white/10' },
  { content: '!', size: 'text-5xl', color: 'text-white/10' },
]

// Definindo variantes de animação para o Framer Motion
const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  },
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  },
  float: {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
    },
  },
  pulse: {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
    },
  },
  bounce: {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  },
  rotate: {
    hidden: { rotate: 0 },
    visible: {
      rotate: [0, 5, 0, -5, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  shimmer: {
    hidden: { opacity: 0.5, x: -100 },
    visible: {
      opacity: [0.5, 1, 0.5],
      x: [100, -100],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  scoreCounter: {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.15, 1],
      filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        ease: 'easeInOut',
      },
    },
  },
  progressBar: {
    hidden: { width: '0%' },
    visible: (custom) => ({
      width: `${custom}%`,
      transition: { duration: 1.5, ease: 'easeOut' },
    }),
  },
  underline: {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: { duration: 0.8, delay: 0.4 },
    },
  },
}

interface QuizResultProps {
  primaryColor?: string
  roomId?: number
  score: number
  totalActivities: number
  startGameAgain: () => void
}

export default function QuizResult({ primaryColor = '#6366f1', roomId = 1, score, totalActivities, startGameAgain }: QuizResultProps) {
  const [countedScore, setCountedScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Calcular porcentagem de acerto com validação
  const percentageScore = useMemo(() => {
    const validScore = Math.min(score, totalActivities)
    return (validScore / Math.max(1, totalActivities)) * 100
  }, [score, totalActivities])

  // Determinar o nível de desempenho
  const performanceLevel = useMemo(() => {
    if (percentageScore >= 90) return 'excellent'
    if (percentageScore >= 70) return 'good'
    if (percentageScore >= 40) return 'average'
    return 'needsImprovement'
  }, [percentageScore])

  // Selecionar mensagem com base no desempenho
  const feedbackMessage = useMemo(() => {
    const messages = feedbackMessages[performanceLevel]
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex]
  }, [performanceLevel])

  // Definir a classe de texto de destaque apropriada para o nível
  const accentColorClass = accentColors[performanceLevel]

  // Lançar confetti adaptado ao nível de desempenho
  const launchConfetti = () => {
    // Cores variadas para o confetti
    const colors = ['#f472b6', '#a855f7', '#38bdf8', '#4ade80', '#fbbf24']

    // Configurações baseadas no nível de desempenho
    const particleCount = {
      excellent: 150,
      good: 100,
      average: 70,
      needsImprovement: 40,
    }[performanceLevel]

    // Lançar confetti principal
    confetti({
      particleCount,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors,
      startVelocity: 35,
      gravity: 0.7,
      shapes: ['circle', 'square'],
      zIndex: 1000,
    })

    // Para desempenhos excelentes e bons, adicionar efeitos extras
    if (performanceLevel === 'excellent' || performanceLevel === 'good') {
      setTimeout(() => {
        // Confetti lateral esquerdo
        confetti({
          particleCount: 40,
          angle: 135,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          colors,
          zIndex: 1000,
        })

        // Confetti lateral direito
        confetti({
          particleCount: 40,
          angle: 45,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          colors,
          zIndex: 1000,
        })
      }, 800)
    }
  }

  // Animação da contagem do score
  useEffect(() => {
    const animateScore = () => {
      // Garantir valores válidos
      const validScore = Math.min(Math.max(0, score), totalActivities)

      const duration = 2000
      const framesPerSecond = 60
      const totalFrames = (duration / 1000) * framesPerSecond
      const increment = validScore / totalFrames

      let currentCount = 0
      let currentFrame = 0

      const countInterval = setInterval(() => {
        currentFrame++
        currentCount = Math.min(currentCount + increment, validScore)
        setCountedScore(Math.floor(currentCount))

        // Atualizar a barra de progresso
        const currentProgress = (currentCount / Math.max(1, totalActivities)) * 100
        setProgress(Math.min(100, Math.max(0, currentProgress)))

        if (currentFrame >= totalFrames) {
          clearInterval(countInterval)
          setCountedScore(validScore)
          setProgress(Math.min(100, Math.max(0, percentageScore)))

          // Lançar confetti após a contagem terminar
          launchConfetti()
          setAnimationComplete(true)
        }
      }, 1000 / framesPerSecond)

      return () => clearInterval(countInterval)
    }

    animateScore()
  }, [score, totalActivities, percentageScore])

  // Componente para os elementos flutuantes no background
  const FloatingElements = () => (
    <>
      {floatingElementsData.map((el, index) => (
        <motion.div
          key={index}
          className={`absolute ${el.size} ${el.color} select-none`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.9, 1, 0.9],
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15 + Math.random() * 10,
            ease: 'easeInOut',
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            zIndex: 0,
          }}
        >
          {el.content}
        </motion.div>
      ))}
    </>
  )

  // Componente para decorações baseadas no nível de desempenho
  const PerformanceDecorations = () => {
    if (performanceLevel === 'excellent') {
      return (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 2.5 + i * 0.1,
                  duration: 0.6,
                },
              }}
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                zIndex: 10,
              }}
            >
              <motion.div variants={variants.pulse} initial="hidden" animate="visible">
                <Star className="h-8 w-8 fill-pink-300 text-pink-300 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )
    } else if (performanceLevel === 'good') {
      return (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 2.5 + i * 0.1,
                  duration: 0.6,
                },
              }}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                zIndex: 10,
              }}
            >
              <motion.div variants={variants.pulse} initial="hidden" animate="visible">
                <Star className="h-6 w-6 fill-cyan-300 text-cyan-300 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )
    }

    return null
  }

  // Componente para o ícone de recompensa
  const RewardIcon = () => {
    let icon
    const iconColor = iconColors[performanceLevel]

    if (performanceLevel === 'excellent') {
      icon = <Trophy className="h-32 w-32 drop-shadow-lg" />
    } else if (performanceLevel === 'good') {
      icon = <Award className="h-28 w-28 drop-shadow-lg" />
    } else if (performanceLevel === 'average') {
      icon = <Star className="h-24 w-24 drop-shadow-lg" />
    } else {
      icon = <BookOpen className="h-24 w-24 drop-shadow-lg" />
    }

    return (
      <motion.div
        className="mb-10"
        variants={variants.fadeInScale}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 2.2,
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        <motion.div style={{ color: iconColor }} className="relative">
          {/* Ícone principal */}
          <motion.div variants={variants.float} initial="hidden" animate="visible">
            {icon}
          </motion.div>

          {/* Efeito de brilho para desempenhos excelentes */}
          {(performanceLevel === 'excellent' || performanceLevel === 'good') && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.3, 1.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{ filter: 'blur(15px)' }}
            />
          )}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 ${backgroundGradients[performanceLevel]} z-50 flex flex-col items-center justify-center overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElements />
        </div>

        {/* Decorações baseadas no desempenho */}
        <PerformanceDecorations />

        {/* Conteúdo Principal */}
        <motion.div
          className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6 py-8"
          variants={variants.staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {/* Título com sublinhado animado */}
          <motion.div className="relative mb-10" variants={variants.fadeInUp}>
            <h1 className="text-center text-5xl font-bold tracking-wide text-white drop-shadow-lg">Quiz Concluído!</h1>
            <motion.div
              className={`mx-auto mt-3 h-1.5 w-48 rounded-full ${accentColorClass}`}
              variants={variants.underline}
              initial="hidden"
              animate="visible"
            />
          </motion.div>

          {/* Ícone de recompensa */}
          <RewardIcon />

          {/* Mensagem de feedback */}
          <motion.div className="mb-10 px-6" variants={variants.fadeInScale}>
            <motion.h2
              className={`text-center text-3xl font-semibold text-white drop-shadow-lg ${accentColorClass}`}
              variants={animationComplete ? variants.pulse : {}}
              initial="hidden"
              animate={animationComplete ? 'visible' : 'hidden'}
            >
              {feedbackMessage}
            </motion.h2>
          </motion.div>

          {/* Exibição da Pontuação */}
          <motion.div
            className={`mb-12 w-full max-w-2xl rounded-xl border border-white/20 ${cardGradients[performanceLevel]} px-8 py-6 shadow-lg backdrop-blur-lg`}
            variants={variants.fadeInUp}
          >
            <div className="flex flex-col items-center">
              <p className="mb-4 text-2xl font-medium text-white">Sua Pontuação:</p>
              <div className="mb-8 flex items-center justify-center gap-3">
                <motion.span
                  className={`text-7xl font-bold ${accentColorClass}`}
                  variants={variants.scoreCounter}
                  initial="hidden"
                  animate={animationComplete ? 'visible' : 'hidden'}
                >
                  {countedScore}
                </motion.span>
                <span className="text-4xl font-medium text-white/80">/</span>
                <span className="text-4xl font-medium text-white/80">{totalActivities}</span>
              </div>

              <div className="relative mt-2 w-full px-2">
                {/* Fundo da barra */}
                <div className="h-6 w-full rounded-full bg-white/20 shadow-inner" />

                {/* Barra de progresso - animação mais rápida (0.3s) */}
                <motion.div
                  className="absolute top-0 left-0 h-6 rounded-full border border-white/30 shadow-md"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }} // Reduzido de 0.5s para 0.3s
                  style={{
                    background: progressGradients[performanceLevel],
                    boxShadow: 'inset 0px 2px 4px rgba(255, 255, 255, 0.3)',
                  }}
                />

                {/* Efeito de brilho na barra de progresso */}
                {animationComplete && (
                  <motion.div
                    className="absolute top-0 left-0 h-6 w-full rounded-full bg-white/40"
                    variants={{
                      hidden: { opacity: 0.5, x: -100 },
                      visible: {
                        opacity: [0.5, 1, 0.5],
                        x: [100, -100],
                        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }, // Velocidade aumentada para 1.5s
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    style={{ maskImage: 'linear-gradient(to right, transparent, white, transparent)' }}
                  />
                )}

                {/* Texto de porcentagem de acerto */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white drop-shadow-md">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Botões de Ação */}
          <motion.div className="grid w-full max-w-2xl grid-cols-2 gap-6" variants={variants.fadeInUp}>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <button
                onClick={startGameAgain}
                className={`h-16 w-full rounded-xl text-lg font-semibold text-white ${buttonGradients[performanceLevel]} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-center gap-3">
                  <RotateCcw className="h-6 w-6" />
                  <span>Jogar Novamente</span>
                </div>
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <Link href={route('quiz.index', roomId)} className="block h-full">
                <button className={`h-16 w-full rounded-xl text-lg font-semibold text-white ${buttonGradients[performanceLevel]} backdrop-blur-sm`}>
                  <div className="flex items-center justify-center gap-3">
                    <Home className="h-6 w-6" />
                    <span>Voltar à Sala</span>
                  </div>
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

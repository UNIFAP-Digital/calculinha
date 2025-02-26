import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

// Estilos de cores vibrantes baseados na referência
const gradientStyles = {
  orange: 'bg-gradient-to-br from-orange-500 to-orange-400',
  teal: 'bg-gradient-to-br from-teal-500 to-teal-400',
  indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-400',
  pink: 'bg-gradient-to-br from-pink-500 to-pink-400',
}

interface QuizIntroProps {
  primaryColor?: string
}

export default function QuizIntro({ primaryColor = '#6366f1' }: QuizIntroProps) {
  const getGradientStyle = () => {
    if (primaryColor.includes('orange')) return gradientStyles.orange
    if (primaryColor.includes('teal')) return gradientStyles.teal
    if (primaryColor.includes('pink')) return gradientStyles.pink

    return gradientStyles.indigo
  }

  const handleStartClick = () => {
    startGame()
  }

  // Elementos matemáticos flutuantes para o fundo
  const MathElements = () => {
    const elements = [
      { icon: '+', size: 'text-6xl', color: 'text-white/20' },
      { icon: '-', size: 'text-5xl', color: 'text-white/15' },
      { icon: '×', size: 'text-7xl', color: 'text-white/20' },
      { icon: '÷', size: 'text-6xl', color: 'text-white/15' },
      { icon: '=', size: 'text-5xl', color: 'text-white/20' },
      { icon: '123', size: 'text-4xl', color: 'text-white/15' },
      { icon: '?', size: 'text-6xl', color: 'text-white/20' },
      { icon: '√', size: 'text-5xl', color: 'text-white/15' },
      { icon: '∑', size: 'text-7xl', color: 'text-white/10' },
      { icon: '∞', size: 'text-6xl', color: 'text-white/15' },
    ]

    return (
      <>
        {elements.map((el, index) => (
          <motion.div
            key={index}
            className={`absolute ${el.size} font-bold ${el.color} select-none`}
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: 0,
              rotate: Math.random() * 20 - 10,
            }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0.1, 0.2, 0.1],
              rotate: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
            }}
            transition={{
              repeat: Infinity,
              duration: 20 + Math.random() * 10,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
            }}
          >
            {el.icon}
          </motion.div>
        ))}
      </>
    )
  }

  return (
    <motion.div
      className={`fixed inset-0 ${getGradientStyle()} flex flex-col items-center justify-center overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Math Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <MathElements />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center justify-center px-6 py-8">
        {/* Title */}
        <motion.div
          className="mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
        >
          <h1 className="text-center text-5xl font-bold tracking-wide text-white drop-shadow-lg">{currentFlow.name || 'Calcuinha'}</h1>
        </motion.div>

        {/* Character/Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.4,
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 },
          }}
        >
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/30 bg-white shadow-xl">
            <span className="text-7xl" style={{ color: primaryColor }}>
              {currentFlow.icon || '🧮'}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div className="mb-10 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-center text-xl font-medium text-white drop-shadow md:text-2xl">
            {currentFlow.description || 'Vamos praticar matemática de um jeito divertido!'}
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          className="w-full max-w-xs"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.8,
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleStartClick}
            className="w-full rounded-full bg-white px-8 py-5 text-2xl font-bold tracking-wide shadow-[0_8px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:translate-y-[-2px] hover:bg-white hover:shadow-[0_10px_0_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-[0_4px_0_0_rgba(0,0,0,0.2)]"
            style={{ color: primaryColor }}
          >
            <span className="flex items-center justify-center gap-3">
              COMEÇAR!
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                👉
              </motion.span>
            </span>
          </Button>
        </motion.div>

        {/* Instruction hint */}
        <motion.p className="mt-8 text-center text-lg text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          Clique para começar o desafio!
        </motion.p>
      </div>
    </motion.div>
  )
}

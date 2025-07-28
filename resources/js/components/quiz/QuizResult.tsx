'use client'

import { colorThemes } from '@/theme'
import { Character, characters } from '@/utils/characters'
import { Link } from '@inertiajs/react'
import motion from 'motion'
import { Coins, Home, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { AppLogo } from '@/components/ui/AppLogo'

// Mensagens sempre positivas e encorajadoras para crianças
const FEEDBACK_MESSAGES = [
  'Parabéns!',
  'Muito bem!',
  'Ótimo trabalho!',
  'Você é incrível!',
  'Fantástico!',
  'Excelente!',
  'Que legal!',
  'Você conseguiu!',
]

// Chalk texture and effects components (from quiz game)
const ChalkTextureFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="chalkTexture">
        <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
  </svg>
)

const ChalkDust = () => {
  const particles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute h-1 w-1 rounded-full bg-white opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -10, 0],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ))
  return <div className="pointer-events-none absolute inset-0">{particles}</div>
}

const MathFloatingElements = () => {
  const elements = ['+', '-', '×', '÷', '=']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl font-bold text-white/8 select-none"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {element}
        </motion.div>
      ))}
    </div>
  )
}

// Static character avatar
function StaticCharacterAvatar({ character }: { character: Character }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px]">
        <img
          src={character.avatarSrc || '/placeholder.svg'}
          alt={`${character.name}`}
          className="h-full w-full object-contain drop-shadow-xl filter"
          loading="eager"
        />
      </div>
    </div>
  )
}

interface QuizResultProps {
  roomId: number
  score: number
  totalActivities: number
  startGameAgain: () => void
  module?: { name?: string; operation?: string }
}

export default function QuizResult({
  roomId,
  score,
  totalActivities,
  startGameAgain,
  module,
}: QuizResultProps) {
  // Get module theme (same as introduction and quiz game)
  const moduleName = module?.name || 'Adição'
  const moduleTheme =
    colorThemes.find((theme) => theme.name === moduleName) || colorThemes[0]

  // Get character (same as introduction)
  const character =
    characters[module?.operation || 'addition'] || characters.addition

  // Get random positive feedback message
  const feedbackMessage = useMemo(() => {
    return FEEDBACK_MESSAGES[
      Math.floor(Math.random() * FEEDBACK_MESSAGES.length)
    ]
  }, [])

  const totalCoins = score * 10

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background (same as quiz game) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0e6245 0%, #0d7a56 50%, #0e6245 100%)',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <ChalkTextureFilter />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            filter: 'url(#chalkTexture)',
            background:
              'linear-gradient(to right, #ffffff 0%, transparent 50%, #ffffff 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.4)',
          }}
        />
        <MathFloatingElements />
        <ChalkDust />
      </div>

      {/* Main content - Fixed height layout */}
      <main className="relative z-10 flex h-full flex-col">
        <div className="flex justify-center pt-4 pb-2">
          <AppLogo iconSize="md" textSize="lg" variant="white" />
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
          <div className="flex w-full max-w-lg flex-col items-center">
            {/* 1. Title */}
            <div className="mb-6 text-center">
              <h1
                className="text-3xl font-bold text-white drop-shadow-2xl sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                  textShadow:
                    '3px 3px 6px rgba(0,0,0,0.7), 1px 1px 3px rgba(0,0,0,0.5)',
                  fontVariationSettings: '"wght" 700',
                }}
              >
                {feedbackMessage}
              </h1>
            </div>

            {/* Character Avatar */}
            <div className="mb-6">
              <StaticCharacterAvatar character={character} />
            </div>

            {/* 2. Acertos */}
            <div className="mb-6 text-center">
              <p
                className="text-lg font-semibold text-white/90 drop-shadow-lg sm:text-xl"
                style={{
                  fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                  fontWeight: '600',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                Você acertou {score} de {totalActivities} questões
              </p>
            </div>

            {/* 3. Moedas */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <p
                  className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl"
                  style={{
                    fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                    fontWeight: '700',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  Você ganhou {totalCoins} calculinhas
                </p>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10"
                  style={{
                    background:
                      'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                  }}
                >
                  <Coins className="h-5 w-5 text-yellow-900 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                className="w-full rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                style={{
                  background: `${moduleTheme.color}`,
                  fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                  fontWeight: '600',
                  letterSpacing: '0.01em',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
                onClick={startGameAgain}
              >
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Jogar Novamente</span>
                </div>
              </button>

              <Link href={route('quiz.index', roomId)} className="block">
                <button
                  className="w-full rounded-2xl border-2 border-white/80 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                    fontWeight: '600',
                    letterSpacing: '0.01em',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Voltar à Sala</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



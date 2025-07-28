'use client'

import { ShinyButton } from '@/components/magicui/shiny-button'
import { Module } from '@/models'
import { colorThemes } from '@/theme'
import { Character, characters, DialogueLine } from '@/utils/characters'
import { AnimatePresence, motion } from 'motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export type ModuleTheme = {
  name: string
  color: string
  gradientStart: string
  gradientEnd: string
  baseColor: string
  accentColor: string
  icon: React.ComponentType<any>
  description: string
  longDescription: string
  isSpecial: boolean
  buttonGradient: string
  buttonShadow: string
}

type GiantStaticAvatarProps = {
  character: Character
}

function GiantStaticAvatar({ character }: GiantStaticAvatarProps) {
  return (
    <div className="relative flex items-end justify-center">
      <div className="relative z-10">
        <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
          <img
            src={character.avatarSrc}
            alt={`Avatar de ${character.name}`}
            className="h-full w-full object-contain drop-shadow-2xl filter"
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}

function LargeDialogueBalloon({
  line,
  isActive,
  onNext,
  isLast,
  moduleTheme,
  dialogues,
  character,
}: {
  line: DialogueLine
  isActive: boolean
  onNext: () => void
  isLast: boolean
  moduleTheme: ModuleTheme
  dialogues: DialogueLine[]
  character: Character
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={line.id}
          className="relative"
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Balão de Diálogo MUITO MAIOR */}
          <div className="relative">
            {/* Cauda do Balão - Responsiva */}
            <div
              className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform sm:-left-6 md:-left-8"
              style={{
                width: 0,
                height: 0,
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                borderRight: `25px solid ${moduleTheme.color}`,
              }}
            />
            <div
              className="absolute top-1/2 -left-2 z-20 -translate-y-1/2 transform sm:-left-3 md:-left-5"
              style={{
                width: 0,
                height: 0,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderRight: '20px solid rgba(255,255,255,0.95)',
              }}
            />

            {/* Caixa de Texto Responsiva */}
            <div
              className="relative flex min-h-[300px] w-full max-w-[90vw] flex-col justify-between rounded-2xl p-6 shadow-2xl backdrop-blur-sm sm:min-h-[400px] sm:max-w-[600px] sm:p-8 md:min-h-[450px] md:max-w-[650px] md:p-12 lg:min-h-[500px] lg:max-w-[700px] lg:p-16"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`,
                border: `3px solid ${moduleTheme.color}`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.25)`,
              }}
            >
              {/* Texto da Fala com Tipografia Fredoka Otimizada */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2
                  className="mb-4 text-lg leading-snug font-semibold text-gray-800 sm:mb-6 sm:text-xl sm:leading-snug md:mb-8 md:text-3xl md:leading-snug lg:text-4xl lg:leading-snug xl:text-5xl xl:leading-snug"
                  style={{
                    fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
                    fontWeight: '600',
                    textShadow:
                      '1px 1px 3px rgba(0,0,0,0.1), 0px 0px 8px rgba(0,0,0,0.05)',
                    letterSpacing: '0.01em',
                    lineHeight: '1.35',
                    wordSpacing: '0.05em',
                    color: '#2d3748',
                    fontVariationSettings: '"wght" 600',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                  role="dialog"
                  aria-live="polite"
                  aria-label={`Diálogo de ${character.name}`}
                >
                  {line.text}
                </h2>
              </motion.div>

              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
                <div
                  className="flex gap-2 sm:gap-3"
                  role="progressbar"
                  aria-valuenow={line.id}
                  aria-valuemin={1}
                  aria-valuemax={dialogues.length}
                  aria-label="Progresso do diálogo"
                >
                  {dialogues.map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-2 rounded-full transition-all duration-300 sm:h-3"
                      style={{
                        width: index + 1 === line.id ? '32px' : '12px',
                        background:
                          index + 1 === line.id
                            ? moduleTheme.color
                            : moduleTheme.color + '40',
                      }}
                      animate={{
                        scale: index + 1 === line.id ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat:
                          index + 1 === line.id ? Number.POSITIVE_INFINITY : 0,
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isLast ? (
                    <ShinyButton
                      className="rounded-2xl px-6 py-3 text-lg font-semibold sm:rounded-2xl sm:px-8 sm:py-4 sm:text-xl md:px-10 md:py-5 md:text-2xl lg:px-12 lg:py-6"
                      style={{
                        background: moduleTheme.buttonGradient,
                        fontFamily:
                          'Fredoka, system-ui, -apple-system, sans-serif',
                        fontWeight: '600',
                        letterSpacing: '0.02em',
                        fontVariationSettings: '"wght" 600',
                        textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                        boxShadow: `0 6px 0 ${moduleTheme.buttonShadow}, 0 12px 24px rgba(0,0,0,0.3)`,
                        height: 'auto',
                      }}
                      onClick={onNext}
                      aria-label="Começar a aventura matemática"
                    >
                      <span className="flex items-center gap-2 sm:gap-3">
                        <span className="hidden sm:inline">
                          Começar Aventura
                        </span>
                        <span className="sm:hidden">Começar</span>
                        <ArrowRight
                          size={20}
                          className="sm:h-6 sm:w-6 md:h-7 md:w-7"
                        />
                      </span>
                    </ShinyButton>
                  ) : (
                    <ShinyButton
                      className="rounded-2xl px-6 py-3 text-lg font-medium sm:px-8 sm:py-4 sm:text-xl md:px-10 md:py-5"
                      style={{
                        background: moduleTheme.color,
                        fontFamily:
                          'Fredoka, system-ui, -apple-system, sans-serif',
                        fontWeight: '500',
                        letterSpacing: '0.02em',
                        fontVariationSettings: '"wght" 500',
                        textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                        height: 'auto',
                      }}
                      onClick={onNext}
                      aria-label="Continuar para o próximo diálogo"
                    >
                      Continuar
                    </ShinyButton>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente Principal
interface MathModuleIntroProps {
  module: Module
  onStart: () => void
}

export default function MathModuleIntro({
  module,
  onStart,
}: MathModuleIntroProps) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const moduleName = module.name || 'Adição'
  const moduleTheme =
    colorThemes.find((theme) => theme.name === moduleName) || colorThemes[0]

  const character =
    characters[module?.operation || 'addition'] || characters.addition
  const dialogues = character.dialogues
  const currentDialogue = dialogues[currentDialogueIndex]

  const handleNext = () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1)
    } else {
      onStart()
    }
  }

  return (
    <main
      className="relative flex h-screen w-screen flex-col overflow-hidden"
      role="main"
      aria-label="Introdução ao módulo matemático"
    >
      {/* Background Image Responsivo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/math-background.jpeg"
          alt=""
          className="h-full w-full object-cover"
          style={{
            filter: 'blur(30px) brightness(0.5)',
          }}
          aria-hidden="true"
        />
        {/* Overlay para melhor contraste */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${moduleTheme.accentColor}40 0%, rgba(255,255,255,0.3) 100%)`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Header Responsivo */}
      <header className="relative z-20 flex flex-col items-center pt-4 pb-2 sm:pt-6 sm:pb-3 md:pt-8 md:pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="px-4 text-center text-2xl font-bold text-white drop-shadow-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            style={{
              fontFamily: 'Fredoka, system-ui, -apple-system, sans-serif',
              fontWeight: '700',
              textShadow:
                '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6), 0 0 15px rgba(0,0,0,0.4)',
              letterSpacing: '0.02em',
              lineHeight: '1.15',
              wordSpacing: '0.08em',
              fontVariationSettings: '"wght" 700',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Uma aventura matemática com {character.name}
          </motion.h1>
        </motion.div>
      </header>

      {/* Conteúdo Principal Responsivo */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 sm:gap-6 md:flex-row md:gap-8 lg:gap-12">
          {/* Avatar Responsivo */}
          <div className="order-2 flex-shrink-0 md:order-1">
            <GiantStaticAvatar character={character} />
          </div>

          {/* Diálogo Responsivo */}
          <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-auto">
            <LargeDialogueBalloon
              line={currentDialogue}
              isActive={true}
              onNext={handleNext}
              isLast={currentDialogueIndex === dialogues.length - 1}
              moduleTheme={moduleTheme}
              dialogues={dialogues}
              character={character}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

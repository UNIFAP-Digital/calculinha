"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, ArrowRight } from "lucide-react"
import { ShinyButton } from "@/components/magicui/shiny-button"
import { colorThemes, FatIcon } from "@/theme"
import { Module } from "@/models"
import { Character, characters, DialogueLine } from "@/utils/characters"

export type ModuleTheme = {
  name: string
  color: string
  gradientStart: string
  gradientEnd: string
  baseColor: string
  accentColor: string
  icon: any
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
    <div className="relative flex justify-center items-end">
      <div className="relative z-10">
        <div className="w-[600px] h-[600px] relative">
          <img
            src={character.avatarSrc}
            alt={"Avatar de " + character.name}
            className="object-contain filter drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}

// Caixa de Texto MUITO MAIOR
function LargeDialogueBalloon({
  line,
  isActive,
  onNext,
  isLast,
  moduleTheme,
  dialogues,
}: {
  line: any
  isActive: boolean
  onNext: () => void
  isLast: boolean
  moduleTheme: ModuleTheme
  dialogues: DialogueLine[];
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
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Balão de Diálogo MUITO MAIOR */}
          <div className="relative">
            {/* Cauda do Balão - Apontando para a ESQUERDA (Avatar) */}
            <div
              className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-10"
              style={{
                width: 0,
                height: 0,
                borderTop: "25px solid transparent",
                borderBottom: "25px solid transparent",
                borderRight: `40px solid ${moduleTheme.color}`,
              }}
            />
            <div
              className="absolute -left-5 top-1/2 transform -translate-y-1/2 z-20"
              style={{
                width: 0,
                height: 0,
                borderTop: "20px solid transparent",
                borderBottom: "20px solid transparent",
                borderRight: "32px solid rgba(255,255,255,0.95)",
              }}
            />

            {/* Caixa de Texto GIGANTE */}
            <div
              className="rounded-3xl p-16 shadow-2xl relative min-h-[500px] flex flex-col justify-between backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`,
                border: `5px solid ${moduleTheme.color}`,
                boxShadow: `0 30px 60px rgba(0,0,0,0.25)`,
                width: "700px", // Largura fixa muito maior
                maxWidth: "none",
              }}
            >
              {/* Texto da Fala com Tipografia Melhorada */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <p
                  className="text-4xl md:text-5xl font-black leading-relaxed text-gray-800 mb-8"
                  style={{
                    fontFamily: "'Fredoka One', 'Quicksand', 'Nunito', sans-serif",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {line.text}
                </p>
              </motion.div>

              {/* Parte Inferior - Progresso e Botão */}
              <div className="flex justify-between items-center">
                {/* Indicadores de Progresso MAIORES */}
                <div className="flex gap-3">
                  {dialogues.map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: index + 1 === line.id ? "48px" : "16px",
                        background: index + 1 === line.id ? moduleTheme.color : moduleTheme.color + "40",
                      }}
                      animate={{
                        scale: index + 1 === line.id ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: index + 1 === line.id ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  {isLast ? (
                    <ShinyButton
                      className="px-12 py-6 text-2xl font-black rounded-2xl"
                      style={{
                        background: moduleTheme.buttonGradient,
                        fontFamily: "'Fredoka One', 'Quicksand', sans-serif",
                        boxShadow: `0 10px 0 ${moduleTheme.buttonShadow}, 0 20px 40px rgba(0,0,0,0.3)`,
                        height: "auto",
                      }}
                      onClick={onNext}
                    >
                      <span className="flex items-center gap-3">
                        Começar Aventura
                        <ArrowRight size={28} />
                      </span>
                    </ShinyButton>
                  ) : (
                    <ShinyButton
                      className="px-10 py-5 text-xl font-bold rounded-xl"
                      style={{
                        background: moduleTheme.color,
                        fontFamily: "'Fredoka One', 'Quicksand', sans-serif",
                        height: "auto",
                      }}
                      onClick={onNext}
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
  module: Module;
  onStart: () => void;
}

export default function MathModuleIntro({ module, onStart }: MathModuleIntroProps) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const moduleName = module.name || "Adição";
  const moduleTheme = colorThemes.find((theme) => theme.name === moduleName) || colorThemes[0]

  const character = characters[module?.operation || 'addition'] || characters.addition
  const dialogues = character.dialogues;
  const currentDialogue = dialogues[currentDialogueIndex]

  const handleNext = () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1)
    } else {
      onStart()
    }
  }

  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col">
      {/* Background Image com BLUR MUITO ALTO */}
      <div className="absolute inset-0 z-0">
        <img
          src="/math-background.jpeg"
          alt="Math Background"
          className="object-cover"
          style={{
            filter: "blur(30px) brightness(0.5)",
          }}
        />
        {/* Overlay adicional para melhor contraste */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${moduleTheme.accentColor}40 0%, rgba(255,255,255,0.3) 100%)`,
          }}
        />
      </div>

      {/* Header MELHORADO no topo */}
      <motion.div
        className="relative z-20 flex flex-col items-center pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        {/* Footer movido para baixo do header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <p
            className="text-2xl font-bold text-white drop-shadow-lg"
            style={{
              fontFamily: "'Fredoka One', 'Quicksand', sans-serif",
              textShadow: "3px 3px 6px rgba(0,0,0,0.6)",
              letterSpacing: "0.5px",
            }}
          >
            Uma aventura matemática com {character.name}
          </p>
        </motion.div>
      </motion.div>

      <div className="flex-1 relative z-10 flex items-end justify-center">
        <div className="w-full flex items-end justify-center gap-8 px-8 pb-8">
          <div className="flex-shrink-0">
            <GiantStaticAvatar character={character} />
          </div>

          <div className="flex items-center pb-32">
            <LargeDialogueBalloon
              line={currentDialogue}
              isActive={true}
              onNext={handleNext}
              isLast={currentDialogueIndex === dialogues.length - 1}
              moduleTheme={moduleTheme}
              dialogues={dialogues}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

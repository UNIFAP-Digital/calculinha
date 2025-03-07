interface QuizIntroProps {
  module: GameModule
  onStart: () => void
}


import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Target, ChevronRight } from "lucide-react"
import {  colorThemes, FatIcon } from "@/theme"

function FatStartButton({ color, baseColor, onClick, text = "COMEÇAR AGORA!" }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef(null)

  return (
    <div className="relative w-full max-w-md mx-auto">
      <button
        ref={buttonRef}
        className="relative group outline-none w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onBlur={() => setIsPressed(false)}
        onClick={onClick}
        aria-label={text}
      >
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}`}
          style={{
            background: baseColor,
            transform: `${isPressed ? "translateY(2px)" : "translateY(6px)"}`,
            filter: "blur(1px)",
          }}
        />

        <div
          className={`relative flex items-center justify-center h-[70px] rounded-full transition-all duration-300 ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}`}
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${baseColor} 100%)`,
            boxShadow: `
              0 ${isPressed ? "2px" : "6px"} 0 ${baseColor},
              0 ${isPressed ? "3px" : "8px"} 15px rgba(0, 0, 0, 0.2),
              inset 0 -4px 0 rgba(0, 0, 0, 0.1)
            `,
            border: "2px solid rgba(255,255,255,0.4)",
            transform: `${isPressed ? "translateY(2px)" : "translateY(0)"}`,
          }}
        >
          <span className="text-white font-bold text-xl md:text-2xl tracking-wide flex items-center justify-center gap-2">
            {text}
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronRight size={24} className="stroke-[3]" />
            </motion.div>
          </span>
        </div>
      </button>
    </div>
  )
}

// Componente para exemplo interativo
function InteractiveExample({ moduleTheme }) {
  const [value1] = useState(Math.floor(Math.random() * 5) + 1)
  const [value2] = useState(Math.floor(Math.random() * 5) + 1)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getResult = () => {
    switch (moduleTheme.name) {
      case "Adição":
        return value1 + value2
      case "Subtração":
        return value1 + value2 - value1
      case "Multiplicação":
        return value1 * value2
      case "Divisão":
        return value2
      default:
        return value1 + value2
    }
  }

  const getExpression = () => {
    switch (moduleTheme.name) {
      case "Adição":
        return `${value1} + ${value2} = ?`
      case "Subtração":  
        return `${value1} - ${value2} = ?`
      case "Multiplicação":
        return `${value1} × ${value2} = ?`
      case "Divisão":
        return `${value1 * value2} ÷ ${value1} = ?`
      default:
        return `${value1} + ${value2} = ?`
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-xl mb-8 mx-auto max-w-sm"
      style={{
        background: moduleTheme.accentColor,
        border: `3px solid ${moduleTheme.color}40`,
        boxShadow: `0 10px 25px ${moduleTheme.color}20`,
      }}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring" }}
    >
      <h3 className="text-center font-bold text-xl mb-4 text-gray-700">Exemplo:</h3>

      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="text-3xl font-bold text-gray-800">{getExpression()}</div>
      </div>

      <motion.button
        className="w-full py-3 rounded-xl font-bold text-white text-lg relative"
        style={{
          background: moduleTheme.color,
          boxShadow: `0 4px 0 ${moduleTheme.baseColor}`,
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98, y: 4, boxShadow: `0 0 0 ${moduleTheme.baseColor}` }}
        onClick={() => setShowAnswer(!showAnswer)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showAnswer ? `Resposta: ${getResult()}` : "Ver resposta"}

        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          animate={{
            x: isHovered ? [0, 5, 0] : 0,
            rotate: showAnswer ? 90 : 0,
          }}
          transition={{
            x: { repeat: isHovered ? Number.POSITIVE_INFINITY : 0, duration: 1 },
            rotate: { duration: 0.3 },
          }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

// Componente para card informativo
function InfoCard({ icon: Icon, title, description, color, delay }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-md"
      style={{ border: `2px solid ${color}40` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5, type: "spring" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ background: color }}
        >
          <Icon size={24} strokeWidth={2} />
        </div>
        <h4 className="font-bold text-lg text-gray-800">{title}</h4>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

// Componente para elementos matemáticos flutuantes
function FloatingMathElements({ moduleTheme }) {
  const numberOfElements = 10

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: numberOfElements }).map((_, index) => {
        const size = Math.random() * 30 + 20
        const startPosition = Math.random() * 100
        const animationDuration = Math.random() * 20 + 15
        const element = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)]

        return (
          <motion.div
            key={index}
            className="absolute text-white font-bold"
            style={{
              top: `${startPosition}vh`,
              left: `${Math.random() * 100}vw`,
              fontSize: `${size}px`,
              color: moduleTheme.color,
              opacity: 0.5,
              y: "-100vh",
              x: `${Math.random() > 0.5 ? 1 : -1} * ${Math.random() * 200}px`,
            }}
            animate={{
              y: "200vh",
              x: `${Math.random() > 0.5 ? 1 : -1} * ${Math.random() * 200}px`,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: animationDuration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            {element}
          </motion.div>
        )
      })}
    </div>
  )
}

// Componente para partículas brilhantes
function SparkleParticles({ moduleTheme }) {
  const numberOfParticles = 20

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: numberOfParticles }).map((_, index) => {
        const size = Math.random() * 5 + 3
        const speed = Math.random() * 100 + 50
        const startPositionX = Math.random() * 100
        const startPositionY = Math.random() * 100
        const animationDuration = Math.random() * 5 + 3

        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              top: `${startPositionY}vh`,
              left: `${startPositionX}vw`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: moduleTheme.color,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              x: `${Math.random() > 0.5 ? 1 : -1} * ${speed}px`,
              y: `${Math.random() > 0.5 ? 1 : -1} * ${speed}px`,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: animationDuration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        )
      })}
    </div>
  )
}

// Interface para as props do componente
interface MathModuleIntroProps {
  moduleName?: string
  onStart: () => void
}

// Componente principal
export default function MathModuleIntro({ moduleName = "Adição", onStart }: MathModuleIntroProps) {
  const [showParticles, setShowParticles] = useState(false)

  const moduleTheme = colorThemes.find((theme) => theme.name === moduleName) || colorThemes[0]

  useEffect(() => {
    const particlesTimer = setTimeout(() => {
      setShowParticles(true)
    }, 1000)

    return () => clearTimeout(particlesTimer)
  }, [])

  const ModuleIcon = moduleTheme.icon

  const infoCards = [
    {
      icon: Brain,
      title: "Aprenda Conceitos",
      description: "Entenda os fundamentos da operação de forma clara e divertida.",
      color: moduleTheme.color,
    },
    {
      icon: Target,
      title: "Pratique Habilidades",
      description: "Resolva exercícios interativos e desafios para fixar o aprendizado.",
      color: moduleTheme.color,
    },
  ]

  return (
    <div className={`min-h-screen w-full px-2 md:px-0 bg-gray-50 grid place-items-center font-nunito`}>
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${moduleTheme.color}30 0%, transparent 50%), 
                       radial-gradient(circle at 70% 60%, ${moduleTheme.color}20 0%, transparent 40%)`,
        }}
      />

      <FloatingMathElements moduleTheme={moduleTheme} />

      {showParticles && <SparkleParticles moduleTheme={moduleTheme} />}

      {/* Main content */}
      <div className="container mx-auto z-10 flex flex-col justify-center ">
        <AnimatePresence>   
            <div className="flex flex-col items-center">
              {/* Main module visualization */}
              <motion.div
                className="w-full overflow-y-auto max-w-4xl mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              >
                <div
                  className="bg-white overflow-hidden rounded-3xl p-6 md:p-8 shadow-xl relative max-h-[80vh] md:max-h-none"
                  style={{
                    border: `3px solid ${moduleTheme.color}30`,
                    boxShadow: `0 20px 50px ${moduleTheme.color}20, 0 10px 20px rgba(0,0,0,0.05)`,
                  }}
                >
                  {/* Decorative background elements */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
                    style={{ background: moduleTheme.color }}
                  />
                  <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-10"
                    style={{ background: moduleTheme.color }}
                  />

                  {/* Module content */}
                  <div className="relative z-10 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <motion.div
                      className="mb-6 text-center"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                    >
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <motion.div
                          whileHover={{
                            rotate: [0, -5, 5, -5, 0],
                            transition: { duration: 0.5 },
                          }}
                        >
                          <FatIcon icon={ModuleIcon} color={moduleTheme.baseColor} size={40} />
                        </motion.div>
                        <h1
                          className="text-4xl md:text-5xl font-extrabold"
                          style={{
                            background: `linear-gradient(135deg, ${moduleTheme.color} 0%, ${moduleTheme.baseColor} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {moduleTheme.name}
                        </h1>
                      </div>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{moduleTheme.description}</p>
                    </motion.div>

                    <InteractiveExample moduleTheme={moduleTheme} />

                    {/* Module description */}
                    <motion.div
                      className="mb-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                        {moduleTheme.longDescription}
                      </p>
                    </motion.div>

                    {/* Info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {infoCards.map((card, index) => (
                        <InfoCard
                          key={index}
                          icon={card.icon}
                          title={card.title}
                          description={card.description}
                          color={card.color}
                          delay={0.7 + index * 0.1}
                        />
                      ))}
                    </div>

                    {/* Start button */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
                      className="mb-4"
                    >
                      <FatStartButton color={moduleTheme.color} baseColor={moduleTheme.baseColor} onClick={onStart} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
       
        </AnimatePresence>
      </div>
    </div>
  )
}


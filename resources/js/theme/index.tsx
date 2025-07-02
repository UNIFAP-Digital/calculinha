import React from 'react'

import { useState } from 'react'

import { Plus, Minus, X, Divide, ChevronRight, LucideIcon, ClipboardCheck, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { DisplayModuleName } from '@/lib/constants'
import { Operation } from '@/models'

export function getTheme(operation: Operation): ModuleTheme {
  switch (operation) {
    case 'addition':
      return colorThemes[1]
    case 'subtraction':
      return colorThemes[2]
    case 'multiplication':
      return colorThemes[3]
    case 'division':
      return colorThemes[4]
  }
}

export type ModuleTheme = {
  name: DisplayModuleName
  color: string
  gradientStart: string
  gradientEnd: string
  baseColor: string
  accentColor: string
  icon: LucideIcon
  description: string
  longDescription: string
  isSpecial: boolean
  buttonGradient: string
  buttonShadow: string
}

export const colorThemes: Array<ModuleTheme> = [
  {
    name: "Pré-Teste",
    color: "#5ebbff",
    gradientStart: "#5ebbff",
    gradientEnd: "#3d9dff",
    baseColor: "#2a85e5",
    accentColor: "#f0f8ff",
    icon: ClipboardCheck,
    description: "Avaliação inicial de conhecimentos",
    longDescription: "Vamos verificar o que você já sabe sobre operações matemáticas com este teste inicial.",
    isSpecial: true,
    buttonGradient: "linear-gradient(135deg, #5ebbff 0%, #3d9dff 100%)",
    buttonShadow: "#2a85e5",
  },
  {
    name: "Adição",
    color: "#20e4bc",
    gradientStart: "#20e4bc",
    gradientEnd: "#0fbf96",
    baseColor: "#0aa582",
    accentColor: "#e8fcf8",
    icon: Plus,
    description: "Aprenda a somar números de forma divertida e interativa!",
    longDescription:
      "Aprenda a somar números de diferentes formas através de exercícios interativos e desafios divertidos.",
    isSpecial: false,
    buttonGradient: "linear-gradient(135deg, #20e4bc 0%, #0fbf96 100%)",
    buttonShadow: "#0aa582",
  },
  {
    name: "Subtração",
    color: "#a18cff",
    gradientStart: "#a18cff",
    gradientEnd: "#7c5cff",
    baseColor: "#6a4aef",
    accentColor: "#f5f2ff",
    icon: Minus,
    description: "Pratique a subtração de valores e resolva problemas!",
    longDescription: "Aprenda a subtrair números e resolver problemas do dia a dia com técnicas simples e divertidas.",
    isSpecial: false,
    buttonGradient: "linear-gradient(135deg, #a18cff 0%, #7c5cff 100%)",
    buttonShadow: "#6a4aef",
  },
  {
    name: "Multiplicação",
    color: "#ff7e7e",
    gradientStart: "#ff7e7e",
    gradientEnd: "#ff5252",
    baseColor: "#e64545",
    accentColor: "#fff2f2",
    icon: X,
    description: "Multiplique números facilmente com técnicas especiais!",
    longDescription:
      "Multiplicar é como somar várias vezes o mesmo número! Aprenda técnicas divertidas para multiplicar rapidamente.",
    isSpecial: false,
    buttonGradient: "linear-gradient(135deg, #ff7e7e 0%, #ff5252 100%)",
    buttonShadow: "#e64545",
  },
  {
    name: "Divisão",
    color: "#5ebbff",
    gradientStart: "#5ebbff",
    gradientEnd: "#3d9dff",
    baseColor: "#2a85e5",
    accentColor: "#f0f8ff",
    icon: Divide,
    description: "Aprenda a dividir valores e compartilhar igualmente!",
    longDescription:
      "A divisão nos ajuda a repartir quantidades em partes iguais. Aprenda a dividir números de forma simples e prática.",
    isSpecial: false,
    buttonGradient: "linear-gradient(135deg, #5ebbff 0%, #3d9dff 100%)",
    buttonShadow: "#2a85e5",
  },
  {
    name: "Pós-Teste",
    color: "#ff7ad9",
    gradientStart: "#ff7ad9",
    gradientEnd: "#ff42c0",
    baseColor: "#e032a8",
    accentColor: "#fff0fb",
    icon: Award,
    description: "Avaliação final de conhecimentos",
    longDescription: "Vamos verificar o quanto você aprendeu com este teste final de conhecimentos.",
    isSpecial: true,
    buttonGradient: "linear-gradient(135deg, #ff7ad9 0%, #ff42c0 100%)",
    buttonShadow: "#e032a8",
  },
]

export const questionTypeColors = {
  Adição: {
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    shadow: "#059669",
  },
  Subtração: {
    gradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    shadow: "#7c3aed",
  },
  Multiplicação: {
    gradient: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
    shadow: "#dc2626",
  },
  Divisão: {
    gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    shadow: "#2563eb",
  },
}

export const chalkboardStyles = {
  background: "linear-gradient(135deg, #0e6245 0%, #0d7a56 50%, #0e6245 100%)",
  woodFrame: {
    borderColor: "#8B4513",
    backgroundImage:
      'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="%23B26B3F"/><stop offset="20%" stopColor="%239E5C32"/><stop offset="40%" stopColor="%23B26B3F"/><stop offset="60%" stopColor="%23854A21"/><stop offset="80%" stopColor="%239E5C32"/><stop offset="100%" stopColor="%23B26B3F"/></linearGradient></defs><rect width="200" height="200" fill="url(%23woodGrain)"/><filter id="woodTexture"><feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="5" stitchTiles="stitch"/><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter><rect width="200" height="200" filter="url(%23woodTexture)" fill="none" stroke="%23854A21" strokeWidth="0.5" strokeOpacity="0.4"/><g fill="%23854A21" fillOpacity="0.2"><ellipse cx="50" cy="30" rx="20" ry="5"/><ellipse cx="150" cy="70" rx="25" ry="7"/><ellipse cx="70" cy="150" rx="15" ry="4"/><ellipse cx="180" cy="120" rx="18" ry="6"/><ellipse cx="30" cy="100" rx="22" ry="5"/></g></svg>\')',
    backgroundSize: "200px 200px",
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
  },
}

export const ChalkTextureFilter = () => (
  <svg width="0" height="0">
    <filter id="chalkTexture">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="3" />
      <feDisplacementMap in="SourceGraphic" scale="5" />
      <feGaussianBlur stdDeviation="0.5" />
      <feComposite operator="in" in2="SourceGraphic" />
    </filter>
  </svg>
)


export const FatIcon = ({ icon: Icon, color, size = 24, className = "" }) => (
  <div
    className={`relative flex items-center justify-center ${className}`}
    style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))" }}
  >
    {/* Base shadow for 3D effect */}
    <div
      className="absolute rounded-full"
      style={{
        width: size + 4,
        height: size + 4,
        background: color,
        opacity: 0.7,
        transform: "translateY(3px)",
        filter: "blur(2px)",
      }}
    />

    {/* Icon background */}
    <div
      className="absolute rounded-full"
      style={{
        width: size + 8,
        height: size + 8,
        background: color,
      }}
    />

    {/* Icon itself */}
    <div className="relative z-10">
      <Icon size={size} strokeWidth={3} color="white" />
    </div>


  </div>
)

export const FatPlayButton = ({ color, baseColor, onClick, text = "COMEÇAR!" }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      className="relative group outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onBlur={() => setIsPressed(false)}
      onClick={onClick}
      aria-label={text}
    >
      {/* Button shadow/glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${isHovered ? "opacity-70 scale-110" : "opacity-50 scale-100"}`}
        style={{
          background: `radial-gradient(circle, ${color}cc 0%, ${color}00 70%)`,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Button base - thicker for 3D effect */}
      <div
        className={`absolute rounded-full transition-all duration-300 ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}`}
        style={{
          width: "100%",
          height: "60px",
          background: baseColor,
          transform: `${isPressed ? "translateY(2px)" : "translateY(4px)"}`,
          filter: "blur(1px)",
        }}
      />

      {/* Button top surface */}
      <div
        className={`relative flex items-center justify-center h-[60px] rounded-full transition-all duration-300 ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}`}
        style={{
          width: "100%",
          background: `linear-gradient(135deg, ${color} 0%, ${baseColor} 100%)`,
          boxShadow: `
            0 ${isPressed ? "2px" : "6px"} 0 ${baseColor},
            0 ${isPressed ? "3px" : "8px"} 10px rgba(0, 0, 0, 0.2),
            inset 0 -3px 0 rgba(0, 0, 0, 0.1)
          `,
          transform: `${isPressed ? "translateY(2px)" : "translateY(0)"}`,
        }}
      >
        <span className="text-white font-bold text-xl tracking-wide flex items-center gap-3">
          {text}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          >
            👉
          </motion.span>
        </span>
      </div>
    </button>
  )
}

export const ChibiIcon = ({ icon: Icon, color, size = 24 }) => (
  <div
    className="rounded-full flex items-center justify-center"
    style={{
      background: "white",
      width: size + 8,
      height: size + 8,
      boxShadow: `0 2px 0 ${color}`,
    }}
  >
    <Icon size={size} color={color} />
  </div>
)

export const ProgressBadge = ({ current, total, moduleTheme }) => (
  <div
    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full shadow-md"
    style={{
      background: moduleTheme.color,
      boxShadow: `0 2px 0 ${moduleTheme.baseColor}, 0 4px 6px rgba(0, 0, 0, 0.1)`,
    }}
  >
    <span className="text-white font-bold text-sm md:text-lg">
      {current} de {total}
    </span>
  </div>
)

export const ScoreIndicator = ({ score }) => (
  <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
    <span className="text-yellow-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    </span>
    <span className="text-gray-800 font-bold">{score}</span>
  </div>
)

export const ProgressBar = ({ current, total, moduleTheme }) => (
  <div className="absolute top-0 left-0 right-0 h-2 bg-white/20">
    <div
      className="h-full transition-all duration-500 ease-out"
      style={{
        width: `${(current / total) * 100}%`,
        background: moduleTheme.color,
      }}
    />
  </div>
)

export const NavigationButton = ({ text, onClick, disabled, moduleTheme }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      className={`flex justify-center items-center w-full px-8 py-4 rounded-2xl shadow-md  gap-3 transition-all duration-200 disabled:opacity-50 ${disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      style={{
        background: isPressed
          ? moduleTheme.baseColor || "#2563eb"
          : moduleTheme.buttonGradient || "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
        boxShadow: `
          0 ${isPressed ? "2px" : "4px"} 0 ${moduleTheme.buttonShadow || "#2563eb"},
          0 ${isPressed ? "2px" : "6px"} 8px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `,
        border: "2px solid rgba(255,255,255,0.5)",
        transform: isPressed ? "translateY(2px)" : isHovered ? "scale(1.05)" : "scale(1)",
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        !disabled && setIsHovered(false)
        !disabled && setIsPressed(false)
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <span className="text-white font-bold text-xl md:text-2xl">{text}</span>
      <ChevronRight size={24} color="white" strokeWidth={2.5} />
    </button>
  )
}

export const AnswerFeedback = ({ correct, onContinue, moduleTheme, withoutFeedback }) => {
  if (withoutFeedback) {
    onContinue()
    return null
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mb-4">
          {correct ? (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">{correct ? "Correto!" : "Incorreto!"}</h2>
        <p className="text-gray-600 mb-6">
          {correct ? "Muito bem! Você acertou a resposta." : "Não foi dessa vez. Tente novamente na próxima questão."}
        </p>
        <button
          className="px-6 py-3 rounded-full shadow-md w-full transition-all duration-200"
          style={{
            background: moduleTheme.color,
            boxShadow: `0 3px 0 ${moduleTheme.baseColor}, 0 4px 6px rgba(0, 0, 0, 0.1)`,
          }}
          onClick={onContinue}
        >
          <span className="text-white font-bold">Continuar</span>
        </button>
      </motion.div>
    </motion.div>
  )
}

export const MathFloatingElements = React.memo(() => {
  const elements = ["+", "-", "×", "÷", "="]
  const positions = Array(15)
    .fill(0)
    .map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: elements[Math.floor(Math.random() * elements.length)],
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute text-white/20 font-bold"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            fontSize: `${pos.size}rem`,
            animation: `float ${pos.duration}s infinite ease-in-out ${pos.delay}s`,
          }}
        >
          {pos.symbol}
        </div>
      ))}
    </div>
  )
})

MathFloatingElements.displayName = "MathFloatingElements"

export const ChalkDust = React.memo(() => {
  const particles = Array(30).fill(null)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, index) => {
        const size = Math.random() * 4 + 1
        const delay = Math.random() * 10
        const duration = Math.random() * 10 + 10
        const startX = Math.random() * 100
        const startY = Math.random() * 100

        return (
          <div
            key={index}
            className="absolute rounded-full bg-white/30"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: `${startY}%`,
              animation: `float ${duration}s infinite ease-in-out ${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
})

ChalkDust.displayName = "ChalkDust"

export const globalStyles = `
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.7;
  }
}
`


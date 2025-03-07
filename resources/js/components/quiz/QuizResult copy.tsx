"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Award, Star, BarChart2, ArrowRight, Home, ClipboardCheck } from "lucide-react"
import { nunito } from "./design-system"
import confetti from "canvas-confetti"
import { Link } from "@inertiajs/react"


const AnimatedTrophy = ({ score, totalPossibleScore, moduleTheme, withFeedback }) => {
  const percentage = (score / totalPossibleScore) * 100
  const isHighScore = percentage >= 70



  // Efeito de confete para pontuações altas
  useEffect(() => {
    if (isHighScore && withFeedback) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(confettiInterval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Lançar confetes de ambos os lados
        confetti({
          particleCount,
          spread: 70,
          origin: { x: randomInRange(0.1, 0.3), y: 0.5 },
          colors: [moduleTheme.color, moduleTheme.baseColor, "#FFD700", "#FFFFFF"],
        })
        confetti({
          particleCount,
          spread: 70,
          origin: { x: randomInRange(0.7, 0.9), y: 0.5 },
          colors: [moduleTheme.color, moduleTheme.baseColor, "#FFD700", "#FFFFFF"],
        })
      }, 250)

      return () => clearInterval(confettiInterval)
    }
  }, [isHighScore, moduleTheme, withFeedback])

  return (
    <div className="relative">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: `radial-gradient(circle, ${moduleTheme.color}80 0%, ${moduleTheme.color}00 70%)`,
          opacity: 0.7,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Trophy SVG with animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{
          scale: 1,
          rotate: [0, 5, 0, -5, 0],
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 0.5, type: "spring" },
          rotate: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="relative z-10"
      >
        <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 drop-shadow-xl">
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M530,92.139v48.298c0,78.441-63.577,142.052-141.975,142.052h-19.877l22.063-22.757    c64.769-1.165,117.073-54.235,117.073-119.295v-36.933h-85.185l2.84-22.728h93.704C524.917,80.774,530,85.86,530,92.139z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M373.827,419.34v25.086H226.173V419.34c0-2.045,1.107-3.949,2.896-4.943l11.188-6.307    c19.365-10.909,31.348-31.393,31.348-53.639v-26.507h56.79v26.507c0,22.245,11.983,42.729,31.348,53.639l11.188,6.307    C372.72,415.391,373.827,417.295,373.827,419.34z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M373.827,419.34v25.086H359.63V419.34c0-2.045-1.107-3.949-2.896-4.943l-11.188-6.307    c-19.365-10.909-31.348-31.393-31.348-53.639v-26.507h14.198v26.507c0,22.245,11.983,42.729,31.348,53.639l11.188,6.307    C372.72,415.391,373.827,417.295,373.827,419.34z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M345.432,305.784v16.478c0,7.841-6.36,14.205-14.198,14.205h-62.469    c-7.837,0-14.198-6.364-14.198-14.205v-16.478H345.432z"
          />
          <rect
            x="271.605"
            y="336.468"
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            width="56.79"
            height="8.353"
          />
          <path
            style={{ fill: "#343B49" }}
            d="M396.543,438.745v99.436H203.457v-99.436c0-3.125,2.556-5.682,5.679-5.682h181.728    C393.988,433.063,396.543,435.62,396.543,438.745z"
          />
          <path
            style={{ fill: "#262D38" }}
            d="M396.543,438.745v99.436h-11.358v-99.436c0-3.125-2.556-5.682-5.679-5.682h11.358    C393.988,433.063,396.543,435.62,396.543,438.745z"
          />
          <path
            style={{ fill: "#262D38" }}
            d="M413.58,535.34v11.364c0,3.125-2.556,5.682-5.679,5.682H192.099c-3.123,0-5.679-2.557-5.679-5.682    V535.34c0-3.125,2.556-5.682,5.679-5.682h215.802C411.025,529.658,413.58,532.215,413.58,535.34z"
          />
          <path
            style={{ fill: "#171C23" }}
            d="M413.58,535.34v11.364c0,3.125-2.556,5.682-5.679,5.682h-11.358c3.123,0,5.679-2.557,5.679-5.682    V535.34c0-3.125-2.556-5.682-5.679-5.682h11.358C411.025,529.658,413.58,532.215,413.58,535.34z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M368.148,461.473v39.774c0,3.125-2.556,5.682-5.679,5.682H237.531    c-3.123,0-5.679-2.557-5.679-5.682v-39.774c0-3.125,2.556-5.682,5.679-5.682h124.938    C365.593,455.791,368.148,458.348,368.148,461.473z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M345.432,305.784v16.478c0,7.841-6.36,14.205-14.198,14.205h-11.358    c7.837,0,14.198-6.364,14.198-14.205v-16.478H345.432z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M240.37,282.488h-28.395C133.577,282.488,70,218.877,70,140.436V92.139    c0-6.279,5.083-11.364,11.358-11.364h93.704v22.728H92.716v36.933c0,65.06,52.304,118.13,117.073,119.295L240.37,282.488z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M439.136,58.046V69.41c0,138.074-62.299,250.011-139.136,250.011S160.864,207.485,160.864,69.41    V58.046H439.136z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M162.142,103.503h-11.358c-0.568-7.472-0.937-15.057-1.136-22.728h11.358    C161.205,88.445,161.574,96.031,162.142,103.503z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M227.195,282.488h-11.358c-6.332-6.989-12.352-14.887-17.946-23.581    c3.919,0.483,7.865,0.739,11.898,0.824C215.241,268.112,221.062,275.726,227.195,282.488z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M345.432,305.784v5.682c-14.254,8.836-29.531,13.637-45.432,13.637s-31.178-4.801-45.432-13.637    v-5.682c14.254,8.836,29.531,13.637,45.432,13.637S331.178,314.62,345.432,305.784z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M439.136,58.046V69.41c0,133.756-58.466,242.994-131.98,249.699    c71.442-6.79,97.906-115.999,97.906-249.699V58.046H439.136z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#E8A615" : "#C0C0C0") : "#E8A615" }}
            d="M453.333,55.205c0,3.921-1.59,7.472-4.146,10.057c-2.584,2.557-6.133,4.148-10.052,4.148H160.864    c-7.837,0-14.198-6.364-14.198-14.205c0-3.921,1.59-7.472,4.146-10.057c2.584-2.557,6.133-4.148,10.052-4.148h278.272    C446.973,41,453.333,47.364,453.333,55.205z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M439.136,69.41c0,3.807-0.057,7.586-0.142,11.364H161.006c-0.085-3.779-0.142-7.557-0.142-11.364    H439.136z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M453.333,55.205c0,3.921-1.59,7.472-4.146,10.057c-2.584,2.557-6.133,4.148-10.052,4.148h-31.235    c3.919,0,7.468-1.591,10.052-4.148c2.556-2.585,4.146-6.137,4.146-10.057c0-7.841-6.36-14.205-14.198-14.205h31.235    C446.973,41,453.333,47.364,453.333,55.205z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M368.148,461.473v39.774c0,3.125-2.556,5.682-5.679,5.682H249.741    c22.943-0.455,98.531-5.341,98.531-51.139h14.198C365.593,455.791,368.148,458.348,368.148,461.473z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#FFCC66" : "#E0E0E0") : "#FFCC66" }}
            d="M237.531,487.042v-23.245c0-1.284,1.04-2.324,2.323-2.324h50.918    C290.772,461.473,250.309,465.735,237.531,487.042z"
          />
          <path
            style={{ fill: "#4E5868" }}
            d="M209.846,464.314v-23.245c0-1.284,1.04-2.324,2.323-2.324h50.918    C263.086,438.745,222.623,443.006,209.846,464.314z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#FFCC66" : "#E0E0E0") : "#FFCC66" }}
            d="M300,310.898c-30.837,0-116.363-65.088-126.727-218.76h33.733    C215.496,280.158,300,310.898,300,310.898z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#FFCC66" : "#E0E0E0") : "#FFCC66" }}
            d="M240.37,421.699c0,0,39.753-25.569,39.753-62.503v62.503H240.37z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#FFCC66" : "#E0E0E0") : "#FFCC66" }}
            d="M166.543,46.682v8.523h-14.198c0-4.688,3.805-8.523,8.519-8.523H166.543z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M447.512,80.774c-0.199,7.671-0.568,15.256-1.164,22.728h-24.249l2.84-22.728H447.512z"
          />
          <path
            style={{ fill: withFeedback ? (isHighScore ? "#B7791D" : "#A0A0A0") : "#B7791D" }}
            d="M399.07,259.248c-5.565,8.551-11.5,16.336-17.747,23.24h-13.175l10.052-10.341l12.011-12.415    C393.193,259.674,396.146,259.504,399.07,259.248z"
          />

          {withFeedback && (
            <motion.text
              x="300"
              y="250"
              textAnchor="middle"
              fill="white"
              fontWeight="bold"
              fontSize="40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.text>
          )}
        </svg>
      </motion.div>

      {/* Stars animation for high scores */}
      {isHighScore && withFeedback && (
        <>
          <motion.div
            className="absolute top-0 left-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Star size={30} fill={moduleTheme.color} color={moduleTheme.color} />
          </motion.div>
          <motion.div
            className="absolute top-10 right-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Star size={20} fill={moduleTheme.color} color={moduleTheme.color} />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Star size={25} fill={moduleTheme.color} color={moduleTheme.color} />
          </motion.div>
        </>
      )}
    </div>
  )
}

// Componente para a prancheta no modo sem feedback
const ClipboardResult = ({ moduleTheme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        {/* Ícone de conclusão */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="rounded-full  flex items-center justify-center">
            <ClipboardCheck size={160} className="text-green-600" />
          </div>
        </motion.div>
   
    </motion.div>
  )
}

// Componente para medalhas de conquistas
const AchievementBadge = ({ icon: Icon, title, description, color, earned, delay = 0 }) => {
  return (
    <motion.div
      className={`bg-white rounded-xl p-4 shadow-md flex items-start gap-4 ${earned ? "" : "opacity-50"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${earned ? "text-white" : "text-gray-400 bg-gray-100"}`}
        style={{ background: earned ? color : undefined }}
      >
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className={`font-bold text-lg ${earned ? "text-gray-800" : "text-gray-500"}`}>{title}</h3>
        <p className={`text-sm ${earned ? "text-gray-600" : "text-gray-400"}`}>{description}</p>
      </div>
      {earned && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
        >
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Componente para estatísticas
const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ background: color }}
        >
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-center" style={{ color }}>
        {value}
      </p>
    </motion.div>
  )
}

// Componente para mensagem de feedback
const FeedbackMessage = ({ score, totalPossibleScore, moduleTheme }) => {
  const percentage = (score / totalPossibleScore) * 100

  let message = "Módulo Concluído"
  let subMessage = "Você completou com sucesso!"

  return (
    <motion.div
      className="text-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: moduleTheme.baseColor }}>
        {message}
      </h2>
      <p className="text-xl text-gray-600">{subMessage}</p>
    </motion.div>
  )
}

// Componente para botão de ação
const ActionButton = ({ text, icon: Icon, onClick, primary = true, moduleTheme }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      className="px-6 py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition-all duration-200 w-full"
      style={{
        background: primary
          ? `linear-gradient(135deg, ${moduleTheme.color} 0%, ${moduleTheme.baseColor} 100%)`
          : "white",
        color: primary ? "white" : moduleTheme.baseColor,
        border: primary ? "none" : `2px solid ${moduleTheme.color}`,
        boxShadow: primary
          ? `0 ${isPressed ? "2px" : "4px"} 0 ${moduleTheme.baseColor}, 0 ${isPressed ? "2px" : "4px"} 6px rgba(0,0,0,0.1)`
          : "0 2px 4px rgba(0,0,0,0.05)",
        transform: isPressed ? "translateY(2px)" : isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <span className="font-bold">{text}</span>
      <Icon size={18} />
    </button>
  )
}

// Componente principal de resultados
interface QuizResultsProps {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number // em segundos
  moduleTheme: any
  withFeedback?: boolean
  onHome: () => void
  onNextModule?: () => void
}

export default function QuizResults({
  score,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  timeSpent,
  moduleTheme,
  withFeedback = true,
  onHome,
  onNextModule,
}: QuizResultsProps) {
  const totalPossibleScore = totalQuestions * 10
  const percentage = (score / totalPossibleScore) * 100

  // Conquistas
  const achievements = [
    {
      icon: Award,
      title: "Completou o Módulo",
      description: "Finalizou todas as questões do módulo",
      color: moduleTheme.color,
      earned: true,
    },
 
  ]

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center font-nunito`}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${moduleTheme.color}20 0%, transparent 50%), 
                       radial-gradient(circle at 70% 60%, ${moduleTheme.color}10 0%, transparent 40%)`,
        }}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: `linear-gradient(135deg, ${moduleTheme.color} 0%, ${moduleTheme.baseColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {withFeedback ? "Resultados" : "Módulo Concluído"}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Módulo: {moduleTheme.name}
            </motion.p>
          </div>

          {withFeedback && (
            <FeedbackMessage score={score} totalPossibleScore={totalPossibleScore} moduleTheme={moduleTheme} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center justify-center">
              {withFeedback ? (
                <>
                  <AnimatedTrophy
                    score={score}
                    totalPossibleScore={totalPossibleScore}
                    moduleTheme={moduleTheme}
                    withFeedback={withFeedback}
                  />

                  <motion.div
                    className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <h2 className="text-3xl font-bold" style={{ color: moduleTheme.baseColor }}>
                      {score} / {totalPossibleScore}
                    </h2>
                    <p className="text-gray-600">pontos</p>
                  </motion.div>
                </>
              ) : (
                <ClipboardResult moduleTheme={moduleTheme} />
              )}
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              <div className="grid grid-cols-1 gap-4">
                {withFeedback ? (
                  <StatCard
                    title="Acertos"
                    value={`${correctAnswers}/${totalQuestions}`}
                    icon={Award}
                    color={moduleTheme.color}
                    delay={0.3}
                  />
                ) : (
                  <StatCard
                    title="Questões"
                    value={`${totalQuestions}`}
                    icon={Award}
                    color={moduleTheme.color}
                    delay={0.3}
                  />
                )}
                <StatCard
                  title="Tempo"
                  value={`${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, "0")}`}
                  icon={BarChart2}
                  color={moduleTheme.baseColor}
                  delay={0.4}
                />
              </div>
            </div>
          </div>

          {withFeedback && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Conquistas</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <AchievementBadge
                    key={index}
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    color={achievement.color}
                    earned={achievement.earned}
                    delay={0.5 + index * 0.2}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="md:w-1/3">
            <Link  href={route('quiz.index', roomId)}>
              <ActionButton
                text="Voltar ao Início"
                icon={Home}
                onClick={onHome}
                primary={false}
                moduleTheme={moduleTheme}
                />
                </Link>
            </div>
            {onNextModule && (
              <div className="md:w-1/3">
                <ActionButton
                  text="Próximo Módulo"
                  icon={ArrowRight}
                  onClick={onNextModule}
                  primary={true}
                  moduleTheme={moduleTheme}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}


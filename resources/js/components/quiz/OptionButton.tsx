import { ModuleTheme } from "@/theme"

interface OptionButtonProps {
  option: {
    id: string,
    text: string,
  }
  index: number
  selected: boolean
  isCorrectAnswer: boolean
  answered: boolean
  onClick: (answer: string) => void
  moduleTheme: ModuleTheme
  withoutFeedback?: boolean
}

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

function OptionButton2({ option, index, selected, correct, answered, onClick, moduleTheme, withoutFeedback }) {
  const [pressed, setIsPressed] = useState(false)
  const holdTimerRef = useRef(null)
  const controls = useAnimation()

  // Determinar cores baseadas no estado
  let buttonGradient = "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)"
  let buttonBaseColor = "#d0d0d0"
  let textColor = "#333333"
  let borderColor = "rgba(255, 255, 255, 0.5)"
  let shadowColor = "rgba(0, 0, 0, 0.1)"

  if (selected && answered) {
    if (withoutFeedback) {
      buttonGradient = "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      buttonBaseColor = "#2563eb"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    } else if (correct) {
      buttonGradient = "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)"
      buttonBaseColor = "#16A34A"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    } else {
      buttonGradient = "linear-gradient(135deg, #F87171 0%, #EF4444 100%)"
      buttonBaseColor = "#DC2626"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    }
  } else if (selected) {
    buttonGradient = moduleTheme.buttonGradient || "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
    buttonBaseColor = moduleTheme.buttonShadow || "#2563eb"
    textColor = "white"
    borderColor = "rgba(255, 255, 255, 0.6)"
    shadowColor = "rgba(0, 0, 0, 0.25)"
  }

  const letters = ["A", "B", "C", "D"]
  const badgeColors = [
    { bg: "#5b9bd5", shadow: "#3a7ab5" },
    { bg: "#9d7ad9", shadow: "#7d5ab9" },
    { bg: "#e57373", shadow: "#c55353" },
    { bg: "#f0ad4e", shadow: "#d08d2e" },
  ]

  
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3 }}
    >
      <button
        className={`relative w-full h-full text-left outline-none ${answered ? "pointer-events-none" : ""}`}
        onClick={() => onClick(index)}

        disabled={answered}
      >
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${isPressed ? "translate-y-1" : "translate-y-[6px]"}`}
          style={{
            background: buttonBaseColor,
            filter: "blur(0.5px)",
          }}
        />

        <motion.div
          animate={controls}
          className={`relative w-full h-full p-4 md:p-5 rounded-xl transition-all duration-300 ${
            isHovered && !answered ? "scale-[1.02]" : "scale-100"
          } ${isPressed ? "translate-y-1" : "translate-y-0"}`}
          style={{
            background: buttonGradient,
            boxShadow: `
              0 ${isPressed ? "2px" : "4px"} 0 ${buttonBaseColor},
              0 ${isPressed ? "2px" : "4px"} 6px ${shadowColor},
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
            border: `2px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center h-full">
            <div
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mr-4 md:mr-5 text-white font-bold text-xl md:text-2xl flex-shrink-0"
              style={{
                background: selected
                  ? "rgba(255,255,255,0.3)"
                  : `linear-gradient(135deg, ${badgeColors[index].bg} 0%, ${badgeColors[index].shadow} 100%)`,
                boxShadow: selected
                  ? "inset 0 2px 4px rgba(0,0,0,0.1)"
                  : `0 2px 0 ${badgeColors[index].shadow}, 0 3px 5px rgba(0,0,0,0.2)`,
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              {letters[index]}
            </div>

            <div className="flex-1 font-bold text-xl md:text-2xl lg:text-3xl" style={{ color: textColor }}>
              {option.text}
            </div>

            {answered && !withoutFeedback && (
              <div className="ml-2 flex-shrink-0">
                {selected && correct ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : selected && !correct ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : correct ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
            )}

            {answered && withoutFeedback && selected && (
              <div className="ml-2 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      </button>
    </motion.div>
  )
}


export function OptionButton({ option, index, selected, isCorrectAnswer, answered, onClick, moduleTheme, withoutFeedback }: OptionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isHeld, setIsHeld] = useState(false)
  const holdTimerRef = useRef(null)
  const controls = useAnimation()

  // Determinar cores baseadas no estado
  let buttonGradient = "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)"
  let buttonBaseColor = "#d0d0d0"
  let textColor = "#333333"
  let borderColor = "rgba(255, 255, 255, 0.5)"
  let shadowColor = "rgba(0, 0, 0, 0.1)"

  if (selected && answered) {
    if (withoutFeedback) {
      buttonGradient = "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      buttonBaseColor = "#2563eb"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    } else if (isCorrectAnswer) {
      buttonGradient = "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)"
      buttonBaseColor = "#16A34A"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    } else {
      buttonGradient = "linear-gradient(135deg, #F87171 0%, #EF4444 100%)"
      buttonBaseColor = "#DC2626"
      textColor = "white"
      borderColor = "rgba(255, 255, 255, 0.6)"
      shadowColor = "rgba(0, 0, 0, 0.25)"
    }
  } else if (selected) {
    buttonGradient = moduleTheme.buttonGradient || "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
    buttonBaseColor = moduleTheme.buttonShadow || "#2563eb"
    textColor = "white"
    borderColor = "rgba(255, 255, 255, 0.6)"
    shadowColor = "rgba(0, 0, 0, 0.25)"
  }

  const letters = ["A", "B", "C", "D"]
  const badgeColors = [
    { bg: "#5b9bd5", shadow: "#3a7ab5" },
    { bg: "#9d7ad9", shadow: "#7d5ab9" },
    { bg: "#e57373", shadow: "#c55353" },
    { bg: "#f0ad4e", shadow: "#d08d2e" },
  ]

  const handleMouseDown = () => {
    if (answered) return
    setIsPressed(true)

    holdTimerRef.current = setTimeout(() => {
      setIsHeld(true)
      controls.start({
        scale: [1, 1.03, 1.01],
        borderRadius: ["0.75rem", "1rem", "0.85rem"],
        rotate: [0, 0.5, -0.5, 0.3, 0],
        transition: {
          duration: 0.6,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      })
    }, 300)
  }

  const handleMouseUp = () => {
    if (answered) return
    setIsPressed(false)
    setIsHeld(false)
    clearTimeout(holdTimerRef.current)

    controls.start({
      scale: 1,
      borderRadius: "0.75rem",
      rotate: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    })
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3 }}
    >
      <button
        className={`relative w-full h-full text-left outline-none ${answered ? "pointer-events-none" : ""}`}
        onClick={() => onClick(option.text)}
        onMouseEnter={() => !answered && setIsHovered(true)}
        onMouseLeave={() => {
          if (!answered) {
            setIsHovered(false)
            setIsHeld(false)
            clearTimeout(holdTimerRef.current)
            controls.start({
              scale: 1,
              borderRadius: "0.75rem",
              rotate: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            })
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={answered}
      >
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${isPressed ? "translate-y-1" : "translate-y-[6px]"}`}
          style={{
            background: buttonBaseColor,
            filter: "blur(0.5px)",
          }}
        />

        <motion.div
          animate={controls}
          className={`relative w-full h-full p-4 md:p-5 rounded-xl transition-all duration-300 ${
            isHovered && !answered ? "scale-[1.02]" : "scale-100"
          } ${isPressed ? "translate-y-1" : "translate-y-0"}`}
          style={{
            background: buttonGradient,
            boxShadow: `
              0 ${isPressed ? "2px" : "4px"} 0 ${buttonBaseColor},
              0 ${isPressed ? "2px" : "4px"} 6px ${shadowColor},
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
            border: `2px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center h-full">
            <div
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mr-4 md:mr-5 text-white font-bold text-xl md:text-2xl flex-shrink-0"
              style={{
                background: selected
                  ? "rgba(255,255,255,0.3)"
                  : `linear-gradient(135deg, ${badgeColors[index].bg} 0%, ${badgeColors[index].shadow} 100%)`,
                boxShadow: selected
                  ? "inset 0 2px 4px rgba(0,0,0,0.1)"
                  : `0 2px 0 ${badgeColors[index].shadow}, 0 3px 5px rgba(0,0,0,0.2)`,
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              {letters[index]}
            </div>

            <div className="flex-1 font-bold text-xl md:text-2xl lg:text-3xl" style={{ color: textColor }}>
              {option.text}
            </div>

            {answered && !withoutFeedback && (
              <div className="ml-2 flex-shrink-0">
                {selected && isCorrectAnswer ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : selected && !isCorrectAnswer ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : isCorrectAnswer ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
            )}

            {answered && withoutFeedback && selected && (
              <div className="ml-2 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      </button>
    </motion.div>
  )
}

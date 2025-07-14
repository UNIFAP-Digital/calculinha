import { AnswerFeedback, ChalkDust, ChalkTextureFilter, ChibiIcon, colorThemes, MathFloatingElements, ModuleTheme, NavigationButton, ProgressBadge, ProgressBar, questionTypeColors, ScoreIndicator } from '@/theme'
import { OptionButton } from "@/components/quiz/OptionButton"
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import '../../../css/quiz.css'


interface QuizGameProps {
  module: Module
  hits: number
  mistakes: number
  progress: string
  activity: Activity
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  handleNextActivity?: () => void
  currentQuestionIndex: number
}

export default function QuizGame({ 
  activity, 
  isAnswered, 
  isCorrect, 
  selectedAnswer, 
  onSelectAnswer, 
  onNextQuestion,
  hits,
  mistakes,
  progress,
  module,
  currentQuestionIndex,
  isLastQuestion,
  withoutFeedback = false 
}: QuizGameProps) {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)
  const { question, options, correct } = activity.content

  const moduleTheme: ModuleTheme = module?.name
    ? colorThemes.find((theme) => theme.name.toLowerCase() === module?.name?.toLowerCase()) || colorThemes[0]
    : colorThemes[0];

  const typeColor = questionTypeColors[moduleTheme.name] || {
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    shadow: "#059669",
  }

  const handleOptionSelect = (answer: string) => {
    if (isAnswered) return
    onSelectAnswer(answer)
  }

  const handleNextQuestion = () => {
    setIsFeedbackVisible(false)
    onNextQuestion?.()
  }

  // Show feedback when answer is selected
  useEffect(() => {
    if (selectedAnswer !== null) {
      setIsFeedbackVisible(true)
    }
  }, [selectedAnswer])

  const shuffledOptions = useMemo(() => {
    const shuffled = [...options]
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    const correctIndex = shuffled.indexOf(correct)
    return { answers: shuffled, correctIndex }
  }, [options, correct])


  const isAnswerButtonDisabled = selectedAnswer === null || isAnswered

  return (
    <div className={`min-h-screen relative font-nunito `}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          borderColor: "#8B4513",
          background: "linear-gradient(135deg, #0e6245 0%, #0d7a56 50%, #0e6245 100%)",
          boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <ChalkTextureFilter />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            filter: "url(#chalkTexture)",
            background: "linear-gradient(to right, #ffffff 0%, transparent 50%, #ffffff 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.4)",
          }}
        />

        <MathFloatingElements />
        <ChalkDust />

        <ProgressBar current={currentQuestionIndex + 1} total={module.stats?.total} moduleTheme={moduleTheme} />
      </div>

      {/* Feedback mode selector */}
      <div className="fixed top-4 left-4 z-30 bg-white rounded-lg shadow-md p-2 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Modo:</span>
        <select
          className="p-1 rounded border text-sm"
          value={withoutFeedback ? "without" : "with"}
          onChange={(e) => setWithoutFeedback(e.target.value === "without")}
        >
          <option value="with">Com Feedback</option>
          <option value="without">Sem Feedback</option>
        </select>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen w-full px-4 overflow-scroll">
        <div className="flex flex-col h-screen pb-12">
          {/* Header */}
          <div className="flex items-start justify-end pt-4 xl:pt-10 px-4 md:px-8 relative">
            {/* Tipo de operação no canto direito */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ScoreIndicator score={score} />
              <div
                className="px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2"
                style={{
                  background: typeColor.gradient,
                  boxShadow: `0 3px 0 ${typeColor.shadow}, 0 4px 8px rgba(0, 0, 0, 0.2)`,
                  border: "2px solid rgba(255,255,255,0.5)",
                }}
              >
                <ChibiIcon icon={moduleTheme.icon} color={typeColor.shadow} size={20} />
                <span className="text-white font-bold text-lg">{moduleTheme.name}</span>
              </div>
            </motion.div>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center md:px-8 md:mt-4">
            <motion.div
              className="w-full max-w-4xl rounded-2xl p-6 md:p-8 text-center shadow-xl relative"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              key={activity.id}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ProgressBadge
                current={currentQuestionIndex + 1}
                total={module.stats?.total}
                moduleTheme={moduleTheme}
              />

              <p className="text-2xl md:text-3xl whitespace-pre-line md:text-4xl text-gray-800 font-bold leading-relaxed tracking-wide md:mt-4">
                {question}
              </p>
            </motion.div>
          </div>

          {/* Options Container */}
          <div className="md:px-8 mb-8 md:mb-28 md:mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {shuffledOptions.answers.map((option, index) => (
                  <div key={index} className="h-14 md:h-full">
                    <OptionButton
                      option={{
                        id: `option-${index}`,
                        text: option,
                      }}
                      index={index}
                      selected={selectedOption === option}
                      isCorrectAnswer={shuffledOptions.correctIndex === index}
                      answered={answered}
                      onClick={handleOptionSelect}
                      moduleTheme={moduleTheme}
                      withoutFeedback={withoutFeedback}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:mb-28 justify-center items-center flex ">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='w-full md:w-1/2 max-w-xl'>
              <NavigationButton
                text="Responder"
                onClick={() => handleNextQuestion()}
                disabled={isAnswerButtonDisabled}
                moduleTheme={moduleTheme}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Answer feedback */}
      <AnimatePresence>
        {isFeedbackVisible && (
          <AnswerFeedback
            correct={isCorrect}
            onContinue={handleNextQuestion}
            moduleTheme={moduleTheme}
            withoutFeedback={withoutFeedback}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
import { AnswerFeedback, ChalkDust, ChalkTextureFilter, ChibiIcon, colorThemes, MathFloatingElements, ModuleTheme, NavigationButton, ProgressBadge, ProgressBar, questionTypeColors, ScoreIndicator } from '@/theme'
import { OptionButton } from "@/components/quiz/OptionButton"
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import '../../../css/quiz.css'
import { Activity } from '@/models'


interface QuizGameProps {
  module: Module
  hits: number
  mistakes: number
  progress: string
  activity: Activity
  totalActivitiesCount: number
  selectedAnswer: string | null
  isAnswered: boolean
  isCorrect: boolean | null
  onSelectAnswer: (answer: string) => void
  onNextQuestion: () => void
  currentQuestionIndex: number
  isLastQuestion: boolean
  withoutFeedback?: boolean
}

export default function QuizGame({ 
  activity, 
  isAnswered, 
  isCorrect, 
  selectedAnswer, 
  onSelectAnswer, 
  onNextQuestion,
  hits,
  totalActivitiesCount,
  mistakes,
  progress,
  module,
  currentQuestionIndex,
  isLastQuestion,
  withoutFeedback = false 
}: QuizGameProps) {
  console.warn("activity", activity, totalActivitiesCount)
  const { question, options, correct_answer_id } = activity.content

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
    onNextQuestion?.()
  }

  const shuffledOptions = useMemo(() => {
    const shuffled = [...options]
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    const correctIndex = shuffled.indexOf(options[correct_answer_id])
    return { answers: shuffled, correctIndex }
  }, [options, correct_answer_id])


  const isAnswerButtonDisabled = selectedAnswer === null && !isAnswered

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

        <ProgressBar current={currentQuestionIndex + 1} total={totalActivitiesCount} moduleTheme={moduleTheme} />
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

      <div className="relative z-10 min-h-screen w-full px-4 overflow-scroll">
        <div className="flex flex-col h-screen pb-12">
          <div className="flex items-start justify-end pt-4 xl:pt-10 px-4 md:px-8 relative">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ScoreIndicator score={hits} />
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
                total={totalActivitiesCount}
                moduleTheme={moduleTheme}
              />

              <p className="text-2xl md:text-3xl whitespace-pre-line text-gray-800 font-bold leading-relaxed tracking-wide md:mt-4">
                {question}
              </p>
            </motion.div>
          </div>

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
                      selected={selectedAnswer === option}
                      isCorrectAnswer={shuffledOptions.correctIndex === index}
                      answered={isAnswered}
                      onClick={() => handleOptionSelect(option)}
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
                text={isAnswered ? (isLastQuestion ? 'Finalizar Quiz' : 'Próxima Pergunta') : 'Responder'}
                onClick={isAnswered ? handleNextQuestion : () => {}}
                disabled={!isAnswered && selectedAnswer === null}
                moduleTheme={moduleTheme}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAnswered && (
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
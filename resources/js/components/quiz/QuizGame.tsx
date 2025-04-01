import { QuizOptionCard } from '@/components/quiz/QuizOptionCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Module } from '@/models'
import { AnswerFeedback, ChalkDust, ChalkTextureFilter, ChibiIcon, colorThemes, MathFloatingElements, ModuleTheme, NavigationButton, ProgressBadge, ProgressBar, questionTypeColors, ScoreIndicator } from '@/theme'
import { OptionButton } from "@/components/quiz/OptionButton"
import { AnimatePresence, motion } from 'framer-motion'
import { FlameIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
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

export  function QuizGame({ mistakes, hits, progress, activity, selectedAnswer, onSelectAnswer }: QuizGameProps) {
  const { question, wrong_answers, correct_answer } = activity

  const shuffledAnswers = useMemo(() => {
    const allAnswers = [...wrong_answers]
    const correctAnswer = correct_answer
    const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1))
    allAnswers.splice(randomIndex, 0, correctAnswer)
    return { answers: allAnswers, correctIndex: randomIndex }
  }, [wrong_answers, correct_answer])

  return (
    <div id="grid" className="bg-blue-500 px-2 text-white sm:px-4">
      <header className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="inline-flex rounded-md bg-blue-600 px-2 py-2 font-bold">
            <FlameIcon fill="red" stroke="orange" />
            <span>{mistakes}</span>
          </span>
          <span className="inline-flex rounded-md bg-blue-600 px-2 py-2 font-bold">
            <span>✅ {hits}</span>
          </span>
        </div>
      </header>
      <div className="grid">
        {/* Question Text */}
        <div className="flex min-h-0 items-center justify-center py-10">
          <Card className="overmodule-visible relative mx-auto max-h-full max-w-3xl min-w-[75%] text-center">
            <Badge className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-slate-700 px-3 py-1 tracking-widest">{progress}</Badge>
            <CardContent className="p-4 px-8 text-slate-950">
              <h1 className="text-center text-xl whitespace-pre-line sm:text-3xl">{question}</h1>
            </CardContent>
          </Card>
        </div>

        <div className="resizable-grid grid gap-4" key={activity.id}>
          <AnimatePresence>
            {/* Options Cards */}
            {shuffledAnswers.answers.map((answer, index) => (
              <QuizOptionCard
                option={{
                  id: `option-${index}`,
                  text: answer,
                }}
                index={index}
                correctIndex={shuffledAnswers.correctIndex}
                selectedAnswer={selectedAnswer !== null ? shuffledAnswers.answers.indexOf(selectedAnswer) : null}
                key={`option-${index}`}
                onClick={() => onSelectAnswer(answer)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 

export default function MathGame({ firstQuestionAnimation = false, selectedAnswer, onSelectAnswer, activity, hits, progress, module, currentQuestionIndex, handleNextActivity }: QuizGameProps) {
  const [selectedOption, setSelectedOption] = useState("")
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [withoutFeedback, setWithoutFeedback] = useState(false)
  const { question, wrong_answers, correct_answer } = activity


  const answered = selectedAnswer !== null

  console.log('WE ARE HERE')

  const moduleTheme: ModuleTheme = module?.name
    ? colorThemes.find((theme) => theme.name.toLowerCase() === module?.name?.toLowerCase()) || colorThemes[0]
    : colorThemes[0];

  const typeColor = questionTypeColors[moduleTheme.name] || {
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    shadow: "#059669",
  }

  const handleOptionSelect = (answer: string) => {
    if (answered) return
    
   
    setSelectedOption(answer)
  }

  const handleAnswer = (index = selectedOption) => {
    if (answered) return

    const isCorrect = activity.correct_answer === selectedOption
    setIsCorrect(isCorrect)
    onSelectAnswer(selectedOption)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    handleNextActivity?.()
    setShowFeedback(false)
    setSelectedOption("")

  }

  const shuffledOptions = useMemo(() => {
    const allAnswers = [...wrong_answers]
    const correctAnswer = correct_answer
    const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1))
    allAnswers.splice(randomIndex, 0, correctAnswer)
    return { answers: allAnswers, correctIndex: randomIndex }
  }, [wrong_answers, correct_answer])


  const isAnswerButtonDisabled = selectedOption === null || answered

  return (
    <div className={`min-h-screen relative overflow-hidden font-nunito`}>
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
      <div className="relative z-10 min-h-screen w-full">
        <div className="flex flex-col h-screen">
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
          <div className="flex-1 flex items-center justify-center px-4 md:px-8 mt-4">
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

              <p className="text-3xl whitespace-pre-line md:text-4xl text-gray-800 font-bold leading-relaxed tracking-wide mt-4">
                {question}
              </p>
            </motion.div>
          </div>

          {/* Options Container */}
          <div className="px-4 md:px-8 mb-24 md:mb-28 mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-4">
                {shuffledOptions.answers.map((option, index) => (
                  <div key={index} className="h-full">
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

          {/* Actions - bottom right */}
          <div className="fixed bottom-8 right-8 z-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <NavigationButton
                text="Responder"
                onClick={() => handleAnswer()}
                disabled={isAnswerButtonDisabled}
                moduleTheme={moduleTheme}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Answer feedback */}
      <AnimatePresence>
        {showFeedback && (
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

import { quizToast } from '@/components/quiz/QuizFeedback'
import { QuizOptionCard } from '@/components/quiz/QuizOptionCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useQuiz } from '@/contexts/QuizContext'
import { AnimatePresence } from 'framer-motion'
import { FlameIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function QuizGame() {
  const { gameState, currentActivity, currentActivityIndex, totalActivities, selectedAnswer, score, handleAnswerSelect: selectAnswer, nextActivity } = useQuiz()

  const [correctAnswersStreak, setCorrectAnswersStreak] = useState(0)

  const shuffledAnswers = useMemo(() => {
    if (!currentActivity?.activity) {
      return { answers: [], correctIndex: -1 }
    }

    const allAnswers = [...currentActivity.activity.wrong_answers]
    const correctAnswer = currentActivity.activity.correct_answer
    const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1))
    allAnswers.splice(randomIndex, 0, correctAnswer)
    return { answers: allAnswers, correctIndex: randomIndex }
  }, [currentActivity?.activity])

  const handleAnswerSelect = (answer: string) => {
    selectAnswer(answer)

    if (!currentActivity?.activity) return

    const isCorrect = answer === currentActivity.activity.correct_answer
    const message = isCorrect ? 'Resposta correta!' : 'Resposta incorreta!'

    if (isCorrect) {
      setCorrectAnswersStreak(correctAnswersStreak + 1)
    } else {
      setCorrectAnswersStreak(0)
    }

    quizToast({
      message,
      type: isCorrect ? 'correct' : 'incorrect',
      button: {
        onClick: () => nextActivity(),
      },
    })
  }

  if (gameState !== 'playing' || !currentActivity || !currentActivity.activity) return null

  return (
    <div id="grid" className="bg-blue-500 px-2 text-white sm:px-4">
      <header className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="inline-flex rounded-md bg-blue-600 px-2 py-2 font-bold">
            <FlameIcon fill="red" stroke="orange" />
            <span>{correctAnswersStreak}</span>
          </span>
          <span className="inline-flex rounded-md bg-blue-600 px-2 py-2 font-bold">
            <span>✅ {score}</span>
          </span>
        </div>
      </header>
      <div className="grid">
        {/* Question Text */}
        <div className="flex min-h-0 items-center justify-center py-10">
          <Card className="relative mx-auto max-h-full max-w-3xl min-w-[75%] overflow-visible text-center">
            <Badge className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-slate-700 px-3 py-1 tracking-widest">
              {currentActivityIndex + 1}/{totalActivities}
            </Badge>
            <CardContent className="p-4 px-8 text-slate-950">
              <h1 className="text-xl sm:text-3xl">{currentActivity.activity!.question}</h1>
            </CardContent>
          </Card>
        </div>

        <div className="resizable-grid grid gap-4" key={currentActivityIndex}>
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
                onClick={() => handleAnswerSelect(answer)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

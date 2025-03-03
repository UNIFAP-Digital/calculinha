import { QuizOptionCard } from '@/components/quiz/QuizOptionCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { GameActivity } from '@/pages/game/GameSelect'
import { AnimatePresence } from 'framer-motion'
import { FlameIcon } from 'lucide-react'
import { useMemo } from 'react'

interface QuizGameProps {
  hits: number
  mistakes: number
  progress: string
  activity: GameActivity
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
}

export default function QuizGame({ mistakes, hits, progress, activity, selectedAnswer, onSelectAnswer }: QuizGameProps) {
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
          <Card className="relative mx-auto max-h-full max-w-3xl min-w-[75%] overmodule-visible text-center">
            <Badge className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-slate-700 px-3 py-1 tracking-widest">{progress}</Badge>
            <CardContent className="p-4 px-8 text-slate-950">
              <h1 className="text-xl sm:text-3xl">{question}</h1>
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

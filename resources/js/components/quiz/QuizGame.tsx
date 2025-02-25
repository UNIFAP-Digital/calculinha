import QuizButton from '@/components/quiz/QuizButton'
import QuizCard from '@/components/quiz/QuizCard'
import QuizProgress from '@/components/quiz/QuizProgress'
import { useQuiz } from '@/contexts/QuizContext'
import { AnimatePresence, motion } from 'framer-motion'

interface QuizGameProps {
  primaryColor: string
  secondaryColor: string
}

export default function QuizGame({ primaryColor, secondaryColor }: QuizGameProps) {
  const { gameState, currentActivity, currentActivityIndex, nextActivity, selectedAnswer, totalActivities, handleAnswerSelect } = useQuiz()

  if (gameState !== 'playing') return null

  return (
    <QuizCard
      backgroundColor={primaryColor}
      animation={{
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 },
      }}
    >
      <div className="space-y-4">
        <h2 className="mt-4 text-center text-2xl font-bold text-white">
          Atividade {currentActivityIndex + 1}/{totalActivities}
        </h2>

        <div className="space-y-4">
          <p className="text-center text-xl font-semibold text-white">{currentActivity.activity!.question}</p>
          <div className="grid grid-cols-2 gap-4">
            {(() => {
              // Combinando as respostas erradas com a correta
              const allAnswers = [...currentActivity.activity!.wrong_answers]

              // Adicionando a resposta correta ao array
              const correctAnswer = currentActivity.activity!.correct_answer

              // Gerando um índice aleatório para inserir a resposta correta
              const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1))

              // Inserindo a resposta correta na posição aleatória
              allAnswers.splice(randomIndex, 0, correctAnswer)

              // Mapeando todas as respostas para renderizar os botões
              return allAnswers.map((choice) => (
                <QuizButton
                  key={choice}
                  onClick={() => handleAnswerSelect(choice)}
                  color={selectedAnswer === choice ? (choice === currentActivity.activity!.correct_answer ? secondaryColor : '#FF4B4B') : 'white'}
                  textColor={selectedAnswer === choice ? 'white' : primaryColor}
                  disabled={selectedAnswer !== null}
                  className="h-24 w-full text-lg"
                >
                  {choice}
                </QuizButton>
              ))
            })()}
          </div>
        </div>

        <QuizProgress current={currentActivityIndex + 1} total={totalActivities} backgroundColor={secondaryColor} />

        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`rounded-xl p-6 ${selectedAnswer === currentActivity.activity!.correct_answer ? 'bg-[#D7FFB8]' : 'bg-[#FFC1C1]'}`}
            >
              <p className="text-center text-lg font-bold text-[#4B4B4B]">
                {selectedAnswer === currentActivity.activity!.correct_answer ? 'Acertou' : 'Errou'}
              </p>
              <div className="mt-4 flex justify-center">
                <QuizButton onClick={nextActivity} color={primaryColor} hoverColor={secondaryColor} className="px-6 py-4 text-lg">
                  Próxima Pergunta
                </QuizButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </QuizCard>
  )
}

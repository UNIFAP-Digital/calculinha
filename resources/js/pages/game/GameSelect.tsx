import { darkenColor, isLightColor, lightenColor } from '@/utils/color'
import { Head, Link } from '@inertiajs/react'
import { useMemo } from 'react'

export interface GameAttempt {
  answer: string
  is_correct: boolean
}

export interface GameActivity {
  id: number
  type: 'multiple_choice'
  order: number
  question: string
  correct_answer: string
  wrong_answers: Array<string>
  attempt: GameAttempt | null
}

export interface GameStats {
  is_completed: boolean
}

export interface GameFlow {
  id: number
  name: string
  description: string
  color: string
  icon: string
  order: number
  stats: GameStats
  activities: Array<GameActivity>
}

export interface Game {
  id: number
  name: string
  flows: Array<GameFlow>
}

export interface GameSelectPageProps {
  response: Game
}

export default function GameSelect({ response }: GameSelectPageProps) {
  const flowsWithStyles = useMemo(() => {
    return response.flows.map((flow) => {
      const isLight = isLightColor(flow.color)
      return {
        ...flow,
        textColor: isLight ? '#000000' : '#FFFFFF',
        gradientStart: flow.color,
        gradientEnd: isLight ? darkenColor(flow.color, 0.2) : lightenColor(flow.color, 0.2),
      }
    })
  }, [response.flows])

  if (response.flows.length === 0) {
    return (
      <>
        <Head title="Jogar" />
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-[#4B4B4B]">Nenhuma operação disponível</h1>
            <p className="text-xl text-[#777777]">Entre em contato com o administrador para adicionar operações.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Jogar" />

      <div className="p-8">
        <div className="mx-auto max-w-xl">
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-[#4B4B4B]">Operações Matemáticas</h1>
            <p className="text-xl text-[#777777]">Aprenda matemática de forma divertida!</p>
          </header>

          <div className="flex flex-col space-y-4 pb-16">
            {flowsWithStyles.map((flow, index) => {
              const totalFlows = response.flows.length
              const progressPercentage = ((index + 1) / totalFlows) * 100

              return (
                <div key={flow.id} className="grid">
                  <div className="grid grid-cols-8 items-center">
                    <div className="justify-self-center">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                        style={{ backgroundColor: flow.color, color: flow.textColor }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-7 flex w-full flex-col">
                      <Link
                        href={route('quiz.game', [response.id, flow.id])}
                        className="w-full rounded-xl p-4 shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${flow.gradientStart}, ${flow.gradientEnd})`,
                        }}
                      >
                        <div className="flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-lg">
                            <span className="text-2xl">{flow.icon}</span>
                          </div>

                          <div className="text-left">
                            <h2 className="text-lg font-bold" style={{ color: flow.textColor }}>
                              {flow.name}
                            </h2>
                            {flow.description && (
                              <p className="text-sm opacity-90" style={{ color: flow.textColor }}>
                                {flow.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-8 items-center">
                    <div></div>
                    <div className="col-span-7">
                      <div className="mt-2 flex items-center gap-2">
                        <div className="bg-border h-2 grow overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${progressPercentage}%`,
                              backgroundColor: flow.color,
                            }}
                          ></div>
                        </div>

                        <div className="rounded-full px-2 py-1 text-xs font-bold shadow-sm" style={{ color: flow.textColor, backgroundColor: flow.color }}>
                          {index + 1} de {totalFlows}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

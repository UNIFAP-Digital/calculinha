'use client'

import { MathSymbols } from '@/components/magicui/particles'
import { darkenColor, isLightColor, lightenColor } from '@/utils/color'
import { CheckCircleIcon, LockIcon, PlayIcon } from 'lucide-react'
import { useMemo } from 'react'

export default function QuizSelect({ room, userProgress = [] }: QuizSelect) {


  const flowsWithStyles = useMemo(() => {
    if (!room.flows || room.flows.length === 0) return []

    return room.flows.map((flow, index) => {
      const progress = userProgress.find((p) => p.flowId === flow.id)
      const isLight = isLightColor(flow.color)
      const isLocked = index > 0 && !progress && (!userProgress[index - 1] || userProgress[index - 1].progress < 100)

      return {
        ...flow,
        textColor: isLight ? '#000000' : '#FFFFFF',
        gradientStart: flow.color,
        gradientEnd: isLight ? darkenColor(flow.color, 0.2) : lightenColor(flow.color, 0.2),
        isLocked: isLocked,
        progress: progress?.progress || 0,
        isCurrentTrail: progress?.isCurrentTrail || false,
        isCompleted: progress?.progress === 100,
      }
    })
  }, [room.flows, userProgress])

  if (!room.flows || room.flows.length === 0) {
    return (
      <div className="relative min-h-screen">
        <MathSymbols className="absolute inset-0" quantity={30} ease={30} />
        <div className="relative flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-[#4B4B4B]">Nenhuma trilha disponível</h1>
            <p className="text-xl text-[#777777]">Entre em contato com o administrador para adicionar trilhas.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Animation */}
      <MathSymbols className="absolute inset-0" quantity={40} ease={30} size={1.2} colors={['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']} />

      {/* Main Content */}
      <div className="relative min-h-screen bg-white/80 p-6 backdrop-blur-sm">
        <div className="mx-auto max-w-xl">
          <header className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-extrabold text-[#4B4B4B]">Calcuinha</h1>
            <p className="text-xl text-[#777777]">Escolha sua trilha de aprendizado</p>
          </header>

          <div className="space-y-6 pb-12">
            {flowsWithStyles.map((flow, index) => (
              <div key={flow.id} className={`transition duration-300 ${flow.isCurrentTrail ? 'scale-[1.02] transform' : ''}`}>
                <div className="relative">
                  {/* Main Card */}
                  <div
                    className={`overflow-hidden rounded-xl shadow-md ${flow.isLocked ? 'opacity-75 grayscale' : ''} ${
                      flow.isCurrentTrail ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                    }`}
                    style={
                      flow.isLocked
                        ? { background: '#E9E9E9' }
                        : {
                            background: `linear-gradient(135deg, ${flow.gradientStart}, ${flow.gradientEnd})`,
                          }
                    }
                  >
                    <div className="p-4">
                      <div className="flex items-center">
                        {/* Trail number and status */}
                        <div className="relative mr-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-full shadow-md ${flow.isLocked ? 'bg-gray-300' : 'bg-white'}`}>
                            {flow.isCompleted ? (
                              <CheckCircleIcon className="h-8 w-8" style={{ color: flow.color }} />
                            ) : (
                              <span className="text-xl font-bold" style={{ color: flow.isLocked ? '#777' : flow.color }}>
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Progress ring around number */}
                          {flow.progress > 0 && flow.progress < 100 && (
                            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="8" />
                              <circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke={flow.isLight ? '#000' : '#fff'}
                                strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 46}
                                strokeDashoffset={2 * Math.PI * 46 * (1 - flow.progress / 100)}
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Trail info */}
                        <div className="flex-grow">
                          <h2 className="text-lg font-bold" style={{ color: flow.isLocked ? '#555' : flow.textColor }}>
                            {flow.name}
                          </h2>
                          {flow.description && (
                            <p className="text-sm opacity-90" style={{ color: flow.isLocked ? '#777' : flow.textColor }}>
                              {flow.description}
                            </p>
                          )}

                          {/* Status badge */}
                          <div className="mt-2">
                            {flow.isLocked ? (
                              <span className="bg-opacity-50 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-500">Bloqueada</span>
                            ) : flow.isCompleted ? (
                              <span className="bg-opacity-50 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-green-700">Concluída</span>
                            ) : flow.progress > 0 ? (
                              <span className="bg-opacity-50 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                Em progresso • {flow.progress}%
                              </span>
                            ) : (
                              <span className="bg-opacity-50 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-purple-700">Disponível</span>
                            )}
                          </div>
                        </div>

                        {/* Trail icon */}
                        <div className="bg-opacity-90 mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                          <span className="text-2xl">{flow.icon}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action button - positioned at bottom right */}
                  <div className="absolute -right-1 -bottom-5">
                    {flow.isLocked ? (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 shadow-md">
                        <LockIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    ) : (
                      <a
                        href={`/quiz/game/${room.id}/${flow.id}`}
                        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                          flow.isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                        } transform transition-colors hover:scale-105`}
                      >
                        <PlayIcon className="h-6 w-6 text-white" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="h-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

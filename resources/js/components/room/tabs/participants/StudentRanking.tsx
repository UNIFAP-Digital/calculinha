import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Activity, Module, Student } from '@/models'
import { cn } from '@/utils/ui'
import { CheckCircle2, ChevronDown, CircleSlash, FileText, Medal, Trophy, Workflow } from 'lucide-react'
import { useState } from 'react'

type StudentRankingProps = {
  student: Student
  position: number
}

export function StudentRanking({ student, position: order }: StudentRankingProps) {
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({})

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const getRankingStyles = (position: number) => {
    switch (position) {
      case 1:
        return 'dark:bg-linear-to-r dark:from-yellow-900/80 dark:to-amber-800/50 dark:border-yellow-600/50 dark:shadow-inner dark:shadow-yellow-950/20 bg-linear-to-r from-yellow-100 to-yellow-50 border-yellow-200'
      case 2:
        return 'dark:bg-linear-to-r dark:from-zinc-900/50 dark:to-zinc-800/30 dark:border-zinc-700/50 bg-linear-to-r from-zinc-100 to-zinc-50 border-zinc-200'
      case 3:
        return 'dark:bg-linear-to-r dark:from-orange-950/50 dark:to-orange-900/30 dark:border-orange-800/50 bg-linear-to-r from-orange-100 to-orange-50 border-orange-200'
      default:
        return 'bg-card'
    }
  }

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />
      default:
        return <span className="text-muted-foreground text-sm font-medium">{position}º</span>
    }
  }

  // Funções utilitárias para lidar com as tentativas e estatísticas
  const hasPlayed = () => {
    return student.attempts && student.attempts.length > 0
  }

  const calculateStudentPoints = () => {
    if (!student.attempts || student.attempts.length === 0) return 0

    // Calcula pontos baseado nas atividades corretas de todos os módulos de todas as tentativas
    let totalPoints = 0

    student.attempts.forEach((attempt) => {
      attempt.modules?.forEach((module) => {
        module.activities?.forEach((activity) => {
          if (activity.is_correct) {
            totalPoints += 1 // ou qualquer lógica de pontuação que você queira implementar
          }
        })
      })
    })

    return totalPoints
  }

  // Obter todos os módulos únicos de todas as tentativas
  const getAllModules = () => {
    if (!student.attempts || student.attempts.length === 0) return []

    const modulesMap = new Map()

    student.attempts.forEach((attempt) => {
      attempt.modules?.forEach((module) => {
        if (!modulesMap.has(module.id)) {
          // Adiciona o módulo com suas atividades
          const moduleWithStats = {
            ...module,
            stats: calculateModuleStats(module),
          }
          modulesMap.set(module.id, moduleWithStats)
        }
      })
    })

    return Array.from(modulesMap.values())
  }

  const calculateModuleStats = (module: Module) => {
    if (!module.activities || module.activities.length === 0) {
      return { total: 0, correct: 0, percentage: 0 }
    }

    const total = module.activities.length
    const correct = module.activities.filter((activity: Activity) => activity.is_correct).length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    return { total, correct, percentage }
  }

  const truncateText = (text: string, maxLength: number = 25) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getActivityAnswer = (moduleId: number, activityId: number) => {
    if (!student.attempts || student.attempts.length === 0) return null

    // Encontra todas as tentativas para esta atividade específica
    const activityAttempts: Activity[] = []

    student.attempts.forEach((attempt) => {
      attempt.modules?.forEach((module) => {
        if (module.id === moduleId) {
          module.activities?.forEach((activity) => {
            if (activity.id === activityId) {
              activityAttempts.push({
                ...activity,
                answer: activity.answer,
                is_correct: activity.is_correct,
                created_at: attempt.created_at,
              })
            }
          })
        }
      })
    })

    if (activityAttempts.length === 0) return null

    // Ordena por data de criação (mais recente primeiro)
    activityAttempts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return {
      lastAttempt: activityAttempts[0],
      totalAttempts: activityAttempts.length,
      correctAttempts: activityAttempts.filter((att) => att.is_correct).length,
      hasCorrectAttempt: activityAttempts.some((att) => att.is_correct),
    }
  }

  const modules = getAllModules()
  const points = calculateStudentPoints()

  return (
    <Collapsible className="overmodule-hidden rounded-lg border shadow-xs">
      <CollapsibleTrigger className="w-full" disabled={!hasPlayed()}>
        <div className={cn('flex w-full items-center gap-4 p-4 transition-all', getRankingStyles(order))}>
          <div className="flex h-8 w-8 items-center justify-center">{getRankingIcon(order)}</div>

          <div className="flex flex-1 items-center justify-between">
            <div className="text-start">
              <h3 className="text-foreground font-medium">{student.name}</h3>
              <p className="text-muted-foreground text-sm">Entrou em {new Date(student.created_at).toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="flex items-center gap-2">
              {!hasPlayed() ? (
                <p className="text-foreground text-lg font-semibold">Ainda não jogou</p>
              ) : (
                <>
                  <div className="text-end">
                    <p className="text-foreground text-lg font-semibold">{points}</p>
                    <p className="text-muted-foreground text-sm">pontos</p>
                  </div>
                  <ChevronDown className="ui-expanded:rotate-180 h-5 w-5 transition-all" />
                </>
              )}
            </div>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-background border-t">
          <div className="divide-y">
            {modules.map((module) => (
              <Collapsible key={module.id} onOpenChange={() => toggleModule(module.id.toString())} open={openModules[module.id.toString()]}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex w-full items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full">
                        <span className="text-sm text-white">{module.icon || <Workflow className="h-4 w-4 text-white" />}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center justify-between">
                      <div className="text-start">
                        <h4 className="font-medium">{module.name}</h4>
                        <p className="text-muted-foreground text-xs">
                          {`${module.stats?.correct}/${module.stats?.total} atividades corretas (${module.stats?.percentage}%)`}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <ChevronDown className="ui-expanded:rotate-180 h-4 w-4 transition-all" />
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Atividades do Module */}
                <CollapsibleContent>
                  <div className="border-t pl-12">
                    <div className="divide-y">
                      {module.activities.map((activity: Activity) => {
                        const attemptInfo = getActivityAnswer(module.id, activity.id)

                        return (
                          <div key={activity.id} className="flex items-center gap-3 px-4 py-2">
                            <div className="flex h-6 w-6 items-center justify-center">
                              <FileText className="text-muted-foreground h-4 w-4" />
                            </div>

                            <div className="flex-1">
                              <p className="text-sm">{activity.question}</p>
                                aki
                              {/*{attemptInfo?.lastAttempt && (*/}
                              {/*  <p className="text-muted-foreground text-xs">*/}
                              {/*    Última tentativa: {truncateText(attemptInfo.lastAttempt.answer)}*/}
                              {/*    {attemptInfo.totalAttempts > 1 && ` (${attemptInfo.correctAttempts}/${attemptInfo.totalAttempts} corretas)`}*/}
                              {/*  </p>*/}
                              {/*)}*/}
                            </div>

                            <div>
                              {attemptInfo ? (
                                attemptInfo.hasCorrectAttempt ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <CircleSlash className="h-5 w-5 text-red-500" />
                                )
                              ) : (
                                <FileText className="text-muted-foreground h-5 w-5" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Participant from '@/models/participant'
import { cn } from '@/utils/ui'
import { CheckCircle2, ChevronDown, CircleSlash, FileText, Medal, Trophy, Workflow } from 'lucide-react'
import { useState } from 'react'

type RankingProps = {
  participant: Participant
  position: number
}

export function ParticipantRanking({ participant, position }: RankingProps) {
  const [openFlows, setOpenFlows] = useState<{ [key: string]: boolean }>({})

  const toggleFlow = (flowId: string) => {
    setOpenFlows((prev) => ({
      ...prev,
      [flowId]: !prev[flowId],
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

  return (
    <Collapsible className="overflow-hidden rounded-lg border shadow-xs">
      <CollapsibleTrigger className="w-full" disabled={participant.stats?.total == 0}>
        <div className={cn('flex w-full items-center gap-4 p-4 transition-all', getRankingStyles(position))}>
          <div className="flex h-8 w-8 items-center justify-center">{getRankingIcon(position)}</div>

          <div className="flex flex-1 items-center justify-between">
            <div className="text-start">
              <h3 className="text-foreground font-medium">{participant.name}</h3>
              <p className="text-muted-foreground text-sm">Entrou em {new Date(participant.created_at).toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="flex items-center gap-2">
              {participant.stats?.total == 0 ? (
                <p className="text-foreground text-lg font-semibold">Ainda não jogou</p>
              ) : (
                <>
                  <div className="text-end">
                    <p className="text-foreground text-lg font-semibold">{participant.stats?.ratio}</p>
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
            {participant.flows!.map((flow) => (
              <Collapsible key={flow.id} onOpenChange={() => toggleFlow(flow.id.toString())} open={openFlows[flow.id.toString()]}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex w-full items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full">
                        <span className="text-sm text-white">{flow.icon || <Workflow className="h-4 w-4 text-white" />}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center justify-between">
                      <div className="text-start">
                        <h4 className="font-medium">{flow.name}</h4>
                        <p className="text-muted-foreground text-xs">
                          {`${flow.stats?.correct}/${flow.stats?.total} atividades corretas (${flow.stats?.percentage}%)`}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <ChevronDown className="ui-expanded:rotate-180 h-4 w-4 transition-all" />
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Atividades do Flow */}
                <CollapsibleContent>
                  <div className="border-t pl-12">
                    <div className="divide-y">
                      {flow.flow_activities!.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 px-4 py-2">
                          <div className="flex h-6 w-6 items-center justify-center">
                            <FileText className="text-muted-foreground h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-sm">{activity.activity!.question}</p>
                            <p className="text-muted-foreground text-xs">
                              Tentativa: {activity.attempt!.answer!.substring(0, 25) + (activity.attempt!.answer.length > 25 ? '...' : '')}
                            </p>
                          </div>

                          <div>
                            {activity.attempt ? (
                              activity.attempt.is_correct ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <CircleSlash className="h-5 w-5 text-red-500" />
                              )
                            ) : (
                              <FileText className="text-muted-foreground h-5 w-5" />
                            )}
                          </div>
                        </div>
                      ))}
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

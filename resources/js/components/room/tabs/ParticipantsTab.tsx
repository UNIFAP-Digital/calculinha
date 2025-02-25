import { Button } from '@/components/ui/button'
import Room from '@/models/room'
import { cn } from '@/utils/ui'
import { Copy, Medal, Trophy, Users } from 'lucide-react'

const mockParticipants = [
  {
    id: 1,
    name: 'João Silva',
    created_at: '2024-01-15',
    points: 1250,
    position: 1,
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    created_at: '2024-01-16',
    points: 1150,
    position: 2,
  },
  {
    id: 3,
    name: 'Pedro Santos',
    created_at: '2024-01-14',
    points: 1050,
    position: 3,
  },
  {
    id: 4,
    name: 'Ana Costa',
    created_at: '2024-01-18',
    points: 950,
    position: 4,
  },
  {
    id: 5,
    name: 'Lucas Ferreira',
    created_at: '2024-01-17',
    points: 850,
    position: 5,
  },
]

type ParticipantsTabProps = {
  room: Room
}

export default function ParticipantsTab({ room }: ParticipantsTabProps) {
  const getRankingStyles = (position: number) => {
    switch (position) {
      case 1:
        return 'dark:bg-gradient-to-r dark:from-yellow-900/80 dark:to-amber-800/50 dark:border-yellow-600/50 dark:shadow-inner dark:shadow-yellow-950/20 bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200'
      case 2:
        return 'dark:bg-gradient-to-r dark:from-zinc-900/50 dark:to-zinc-800/30 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-100 to-zinc-50 border-zinc-200'
      case 3:
        return 'dark:bg-gradient-to-r dark:from-orange-950/50 dark:to-orange-900/30 dark:border-orange-800/50 bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200'
      default:
        return 'bg-card hover:bg-muted/50'
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
        return <span className="text-sm font-medium text-muted-foreground">{position}º</span>
    }
  }

  return (
    <div className="space-y-2">
      {mockParticipants.length > 0 ? (
        mockParticipants.map((participant) => (
          <div
            key={participant.id}
            className={cn('flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-all', getRankingStyles(participant.position))}
          >
            <div className="flex h-8 w-8 items-center justify-center">{getRankingIcon(participant.position)}</div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{participant.name}</h3>
                <p className="text-sm text-muted-foreground">Entrou em {new Date(participant.created_at).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{participant.points}</p>
                <p className="text-sm text-muted-foreground">pontos</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg bg-background p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">Nenhum participante ainda</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">Para convidar participantes, compartilhe estas instruções:</p>

            <div className="mb-6 w-full max-w-sm space-y-4 rounded-lg bg-muted p-4 text-left">
              <p className="text-sm text-foreground">
                1. Acesse: <span className="mt-1 block break-all rounded bg-background px-3 py-2 font-mono text-sm">{route('invite')}</span>
              </p>

              <p className="text-sm text-foreground">
                2. Insira o código:
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-background px-3 py-2 font-mono text-sm">{room.invite_code}</code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(room.invite_code)
                      alert('Código copiado!')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Após inserir o código, o participante terá acesso imediato à sala.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

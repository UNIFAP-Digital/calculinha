import { Button } from '@/components/ui/button'
import Room from '@/models/room'
import { Copy, Users } from 'lucide-react'

type EmptyParticipantsCardProps = {
  room: Room
}

export default function EmptyParticipantsCard({ room }: EmptyParticipantsCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.invite_code).then()
    alert('Código copiado!')
  }

  return (
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
              <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyCode}>
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
  )
}

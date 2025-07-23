import { Button } from '@/components/ui/button'
import { Room } from '@/models'
import { Copy, Users } from 'lucide-react'

type EmptyParticipantsCardProps = {
  room: Room
}

export default function EmptyParticipantsCard({ room }: EmptyParticipantsCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.invite_code).then()
    alert('Código copiado!')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin).then()
    alert('Link copiado!')
  }

  return (
    <div className="bg-background rounded-lg p-8 shadow-xs">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-muted mb-4 rounded-full p-3">
          <Users className="text-muted-foreground h-6 w-6" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-medium">Nenhum participante ainda</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-sm">Para convidar participantes, compartilhe estas instruções:</p>

        <div className="bg-muted mb-6 w-full max-w-sm space-y-4 rounded-lg p-4 text-left">
          <div className="text-foreground text-sm">
            1. Acesse:
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-background flex-1 rounded px-3 py-2 font-mono text-sm break-all">{window.location.origin}</span>
              <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-foreground text-sm">
            2. Insira o código:
            <div className="mt-1 flex items-center gap-2">
              <code className="bg-background flex-1 rounded px-3 py-2 font-mono text-sm">{room.invite_code}</code>
              <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          <p>Após inserir o código, o participante terá acesso imediato à sala.</p>
        </div>
      </div>
    </div>
  )
}

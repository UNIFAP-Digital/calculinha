import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Room from '@/models/room'
import { useForm } from '@inertiajs/react'
import { FormEvent, useEffect } from 'react'
import { toast } from 'sonner'

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: Room | null
}

export default function RoomFormDialog({ open, onOpenChange, room }: RoomDialogProps) {
  const isEditing = !!room

  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    is_active: true as boolean,
  })

  useEffect(() => {
    if (room) {
      setData('name', room.name)
      setData('is_active', room.is_active)
    } else {
      reset()
    }
  }, [reset, room, setData])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      put(route('rooms.update', room.id), {
        preserveState: true,
        preserveScroll: true,
        preserveUrl: true,
        onSuccess: () => {
          onOpenChange(false)
          toast('A sala foi atualizada com sucesso.')
        },
      })
    } else {
      post(route('rooms.store'), {
        preserveState: true,
        onSuccess: () => {
          reset()
          onOpenChange(false)
          toast('A sala foi criada com sucesso.')
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Sala' : 'Adicionar Sala'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da sala.'
              : 'Adicionando uma sala para vincular fluxos de atividades a ela e convidar seus alunos para resolver elas.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Digite o nome da sala" autoFocus />
              <InputError message={errors.name} />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="active">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                  <Label htmlFor="active">{data.is_active ? 'Ativa' : 'Inativa'}</Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="destructive" onClick={() => onOpenChange(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {isEditing ? 'Salvar Alterações' : 'Criar Sala'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const form = useForm({
    name: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    form.post(route('rooms.store'), {
      onSuccess() {
        form.reset()
        onClose()
        toast('A sala foi criada com sucesso.')
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Adicione uma sala</DialogTitle>
            <DialogDescription>Adicionando uma sala para vincular fluxos de atividades a ela e convidar seus alunos para resolver elas.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3 grid gap-2">
                <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Digite o nome da sala" autoFocus />
                <InputError message={form.errors.name} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="destructive" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.processing}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

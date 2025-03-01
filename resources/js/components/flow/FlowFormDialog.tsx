import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import Flow from '@/models/flow'
import { useForm } from '@inertiajs/react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface FlowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flow?: Flow
}

export default function FlowFormDialog({ open, onOpenChange, flow }: FlowDialogProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const isEditing = !!flow

  const { data, setData, errors, post, put, processing, reset } = useForm({
    name: '',
    description: '',
    color: '#4F46E5',
    icon: '🎮',
  })

  useEffect(() => {
    if (flow) {
      setData({
        name: flow?.name ?? '',
        description: flow?.description ?? '',
        color: flow?.color ?? '#4F46E5',
        icon: flow?.icon ?? '🎮',
      })
    } else {
      reset()
    }
  }, [flow, reset, setData])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      put(route('flows.update', flow.id), {
        preserveState: true,
        preserveScroll: true,
        preserveUrl: true,
        onSuccess: () => {
          onOpenChange(false)
          reset()
          toast('A trilha foi atualizada com sucesso.')
        },
      })
    } else {
      post(route('flows.store'), {
        preserveState: true,
        onSuccess: () => {
          onOpenChange(false)
          reset()
          toast('A trilha foi criada com sucesso.')
        },
      })
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setData('icon', emojiData.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Trilha' : 'Adicionar Trilha'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Modifique os detalhes da trilha.' : 'Crie uma nova trilha para anexar atividades nela.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nome da trilha" required />
            <InputError message={errors.name} />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Breve descrição da trilha"
              maxLength={160}
              rows={2}
            />
            <InputError message={errors.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ícone</Label>
              <Popover modal={true} open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-2xl" type="button">
                    {data.icon}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                  <EmojiPicker onEmojiClick={onEmojiClick} lazyLoadEmojis skinTonesDisabled previewConfig={{ showPreview: false }} />
                </PopoverContent>
              </Popover>
              <InputError message={errors.icon} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" name="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} />
              <InputError message={errors.color} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {isEditing ? 'Salvar Alterações' : 'Criar Trilha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Module } from '@/models'
import { Activity } from '@/models/activity'
import { Head, useForm } from '@inertiajs/react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { ArrowLeft } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ModuleFormPageProps {
  module?: Module
  activities: Activity[]
}

export default function ModuleFormPage({ module, activities }: ModuleFormPageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const isEditing = !!module
  const requiredActivities = 10
  const title = isEditing ? 'Editar Trilha' : 'Adicionar Trilha'

  const { data, setData, errors, post, put, processing, reset } = useForm({
    name: '',
    description: '',
    color: '#4F46E5',
    icon: '🎮',
    activity_ids: [] as number[],
  })

  useEffect(() => {
    if (module) {
      setData({
        name: module?.name ?? '',
        description: module?.description ?? '',
        color: module?.color ?? '#4F46E5',
        icon: module?.icon ?? '🎮',
        activity_ids: module?.activities?.map((activity) => activity.id) ?? [],
      })
    } else {
      reset()
    }
  }, [module, reset, setData])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      put(route('modules.update', module.id), {
        onSuccess: () => {
          toast.success('A trilha foi atualizada com sucesso.')
        },
      })
    } else {
      post(route('modules.store'), {
        onSuccess: () => {
          reset()
          toast.success('A trilha foi criada com sucesso.')
        },
      })
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setData('icon', emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const toggleActivity = (activityId: number) => {
    if (data.activity_ids.includes(activityId)) {
      setData(
        'activity_ids',
        data.activity_ids.filter((id) => id !== activityId),
      )
    } else {
      setData('activity_ids', [...data.activity_ids, activityId])
    }
  }

  return (
    <>
      <Head title={title} />
      <Container
        header={
          <>
            <PageHeader title={title} />

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Trilha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nome da trilha" required />
                    <InputError message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Breve descrição da trilha"
                      maxLength={160}
                      rows={4}
                    />
                    <InputError message={errors.description} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
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

                    <div className="grid gap-2">
                      <Label htmlFor="color">Cor</Label>
                      <Input id="color" name="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                      <InputError message={errors.color} />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={processing || data.activity_ids.length !== requiredActivities}>
                      {isEditing ? 'Salvar Alterações' : 'Adicionar Trilha'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <h1>Selecione as Atividades</h1>
                      <span className={`text-sm font-medium ${data.activity_ids.length === requiredActivities ? 'text-green-600' : 'text-red-600'}`}>
                        {data.activity_ids.length} de {requiredActivities} selecionadas
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.activity_ids.length !== requiredActivities && (
                    <Alert className="mb-4">
                      <AlertDescription>Você precisa selecionar exatamente {requiredActivities} atividades para continuar.</AlertDescription>
                    </Alert>
                  )}

                  <div className="overmodule-y-auto max-h-[600px] space-y-3 pr-2">
                    {activities.map((activity) => (
                      <Card
                        key={activity.id}
                        className={`transition-all duration-200 ${data.activity_ids.includes(activity.id) ? 'border-primary border-2' : ''}`}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`activity-${activity.id}`}
                              checked={data.activity_ids.includes(activity.id)}
                              onCheckedChange={() => toggleActivity(activity.id)}
                            />
                            <Label htmlFor={`activity-${activity.id}`} className="cursor-pointer font-medium">
                              {activity.question}
                            </Label>
                          </div>
                          <div className="text-muted-foreground text-sm">{activity.type}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {activities.length === 0 && <div className="text-muted-foreground py-8 text-center">Nenhuma atividade disponível para seleção.</div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Container>
    </>
  )
}

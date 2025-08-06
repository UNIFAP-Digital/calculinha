import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Module } from '@/models'
import { Activity } from '@/models/activity'
import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { FormEvent, useMemo } from 'react'
import { toast } from 'sonner'

interface ModuleFormPageProps {
  module?: Module
  activities: Activity[]
}

export default function ModuleFormPage({
  module,
  activities,
}: ModuleFormPageProps) {
  const isEditing = !!module
  const requiredActivities = 10
  const title = isEditing ? 'Editar Trilha' : 'Adicionar Trilha'

  const { data, setData, errors, post, put, processing, reset } = useForm({
    name: module?.name ?? '',
    description: module?.description ?? '',
    operation: module?.operation ?? '',
    activity_ids: module?.activities?.map((activity) => activity.id) ?? [],
  })

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

  const filteredActivities = useMemo(() => {
    if (!data.operation) return []
    return activities.filter(
      (activity) => activity.operation === data.operation,
    )
  }, [activities, data.operation])

  const handleOperationChange = (value: string) => {
    setData({
      ...data,
      operation: value,
      activity_ids: [],
    })
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
        }>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Trilha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Nome da trilha"
                      required
                    />
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

                  <div className="grid gap-2">
                    <Label htmlFor="operation">Operação</Label>
                    <Select
                      disabled={isEditing}
                      value={data.operation}
                      onValueChange={handleOperationChange}>
                      <SelectTrigger id="operation">
                        <SelectValue placeholder="Selecione uma operação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addition">Adição</SelectItem>
                        <SelectItem value="subtraction">Subtração</SelectItem>
                        <SelectItem value="multiplication">
                          Multiplicação
                        </SelectItem>
                        <SelectItem value="division">Divisão</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.operation} />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        processing ||
                        !data.operation ||
                        data.activity_ids.length !== requiredActivities
                      }>
                      {isEditing ? 'Salvar Alterações' : 'Adicionar Trilha'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <h1>Selecione as Atividades</h1>
                      <span
                        className={`text-sm font-medium ${data.activity_ids.length === requiredActivities ? 'text-green-600' : 'text-red-600'}`}>
                        {data.activity_ids.length} de {requiredActivities}{' '}
                        selecionadas
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                  {!data.operation && (
                    <Alert className="mb-4">
                      <AlertDescription>
                        Selecione uma operação para visualizar as atividades
                        disponíveis.
                      </AlertDescription>
                    </Alert>
                  )}

                  {data.operation &&
                    data.activity_ids.length !== requiredActivities && (
                      <Alert className="mb-4">
                        <AlertDescription>
                          Você precisa selecionar exatamente{' '}
                          {requiredActivities} atividades para continuar.
                        </AlertDescription>
                      </Alert>
                    )}

                  {data.operation && (
                    <div className="flex-1 space-y-3 pr-2">
                      {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity) => (
                          <Card
                            key={activity.id}
                            className={`transition-all duration-200 ${data.activity_ids.includes(activity.id) ? 'border-primary border-2' : ''}`}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`activity-${activity.id}`}
                                  checked={data.activity_ids.includes(
                                    activity.id,
                                  )}
                                  onCheckedChange={() =>
                                    toggleActivity(activity.id)
                                  }
                                />
                                <Label
                                  htmlFor={`activity-${activity.id}`}
                                  className="cursor-pointer font-medium">
                                  {activity.question}
                                </Label>
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {activity.type}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-muted-foreground py-8 text-center">
                          Nenhuma atividade disponível para a operação
                          selecionada.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Container>
    </>
  )
}

import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Module, Room } from '@/models'
import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { FormEvent, useEffect } from 'react'
import { toast } from 'sonner'

interface RoomFormPageProps {
  room?: Room
  modules: Module[]
}

export default function RoomFormPage({ room, modules }: RoomFormPageProps) {
  const isEditing = !!room
  const requiredModules = 4
  const title = isEditing ? 'Editar Sala' : 'Adicionar Sala'

  const effectiveRequiredModules = Math.min(requiredModules, modules.length);

  const { data, setData, errors, post, put, processing, reset } = useForm({
    name: '',
    is_active: true as boolean,
    // Use o número efetivo para a seleção padrão.
    module_ids: modules.slice(0, effectiveRequiredModules).map((module) => module.id),
  });

  useEffect(() => {
    if (room) {
      setData({
        name: room?.name ?? '',
        is_active: room?.is_active ?? true,
        module_ids: room?.modules?.map((module) => module.id) ?? [],
      });
    } else {
      reset('name', 'is_active');
      setData(
        'module_ids',
        modules.slice(0, effectiveRequiredModules).map((module) => module.id),
      );
    }
  }, [room, effectiveRequiredModules]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      put(route('rooms.update', room.id), {
        onSuccess: () => {
          toast.success('A sala foi atualizada com sucesso.')
        },
      })
    } else {
      post(route('rooms.store'), {
        onSuccess: () => {
          reset()
          toast.success('A sala foi criada com sucesso.')
        },
      })
    }
  }

  const toggleModule = (moduleId: number) => {
    if (data.module_ids.includes(moduleId)) {
      setData(
        'module_ids',
        data.module_ids.filter((id) => id !== moduleId),
      )
    } else {
      setData('module_ids', [...data.module_ids, moduleId])
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
                  <CardTitle>Sala</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nome da sala" required />
                    <InputError message={errors.name} />
                  </div>

                  {isEditing && (
                    <div className="grid gap-2">
                      <Label htmlFor="active">Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                        <Label htmlFor="active">{data.is_active ? 'Ativa' : 'Inativa'}</Label>
                      </div>
                      <InputError message={errors.is_active} />
                    </div>
                  )}

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={processing || data.module_ids.length !== requiredModules}>
                      {isEditing ? 'Salvar Alterações' : 'Adicionar Sala'}
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
                      <h1>Selecione as Trilhas</h1>
                      <span className={`text-sm font-medium ${data.module_ids.length === requiredModules ? 'text-green-600' : 'text-red-600'}`}>
                        {data.module_ids.length} de {requiredModules} selecionadas
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.module_ids.length !== requiredModules && (
                    <Alert className="mb-4">
                      <AlertDescription>Você precisa selecionar exatamente {requiredModules} trilhas para continuar.</AlertDescription>
                    </Alert>
                  )}

                  <div className="overmodule-y-auto max-h-[600px] space-y-3 pr-2">
                    {modules.map((module) => (
                      <Card key={module.id} className={`transition-all duration-200 ${data.module_ids.includes(module.id) ? 'border-primary border-2' : ''}`}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`module-${module.id}`}
                              checked={data.module_ids.includes(module.id)}
                              onCheckedChange={() => toggleModule(module.id)}
                            />
                            <Label htmlFor={`module-${module.id}`} className="cursor-pointer font-medium">
                              <span className="mr-2">{module.icon}</span>
                              {module.name}
                            </Label>
                          </div>
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: module.color! }}></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {modules.length === 0 && <div className="text-muted-foreground py-8 text-center">Nenhuma trilha disponível para seleção.</div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Container>
    </>
  )
}

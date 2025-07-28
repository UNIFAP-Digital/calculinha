import Container from '@/components/Container'
import ModuleCard from '@/components/module/ModuleCard'
import { Button } from '@/components/ui/button'
import { Module } from '@/models'
import { Head, Link, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

type ModuleShowProps = {
  modules: Module[]
  currentModule: Module
}

export default function ModuleShowPage({ modules, currentModule }: ModuleShowProps) {
  // Verificar se os dados foram carregados corretamente
  if (!currentModule || !modules) {
    return <div>Carregando...</div>
  }

  const handleCreate = () => {
    router.visit(route('modules.create'))
  }

  const handleSelect = (module: Module) => {
    if (module.id === currentModule.id) return
    // Forçar uma requisição HTTP normal em vez de AJAX para evitar problemas de carregamento
    router.visit(route('modules.show', module.id), {
      method: 'get',
      preserveState: false,
      preserveScroll: false,
    })
  }

  const handleEdit = (module: Module) => {
    router.visit(route('modules.edit', module.id))
  }

  const handleDelete = (module: Module) => {
    router.delete(route('modules.destroy', module.id), {
      onSuccess() {
        toast.success('Trilha apagada com sucesso.')
        router.visit(route('modules.index'))
      },
    })
  }

  return (
    <>
      <Head title={`Trilha ${currentModule.name}`} />
      <Container>
        <div className="flex flex-col md:flex-row">
          {/* Sidebar de Módulos */}
          <div className="md:w-80">
            <div className="space-y-3">
              <Button
                onClick={handleCreate}
                variant="outline"
                className="w-full justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Trilha
              </Button>

              {modules && modules.length > 0 && modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isSelected={currentModule?.id === module.id}
                  onClick={() => handleSelect(module)}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="ms-0 mt-4 flex-1 md:ms-4 md:mt-0">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{currentModule.name}</h1>
                  <p className="text-muted-foreground">{currentModule.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(currentModule)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(currentModule)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              {/* Informações da Trilha */}
              <div className="bg-background rounded-lg p-6 shadow-xs">
                <h2 className="text-lg font-semibold mb-4">Informações da Trilha</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tipo:</span>
                    <span className="ml-2">{currentModule.type}</span>
                  </div>
                  <div>
                    <span className="font-medium">Operação:</span>
                    <span className="ml-2">{currentModule.operation}</span>
                  </div>
                  <div>
                    <span className="font-medium">Cor:</span>
                    <div className="ml-2 inline-block w-4 h-4 rounded" style={{ backgroundColor: currentModule.color }} />
                  </div>
                  <div>
                    <span className="font-medium">Atividades:</span>
                    <span className="ml-2">{currentModule?.activities?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Atividades */}
              <div className="bg-background rounded-lg p-6 shadow-xs">
                <h2 className="text-lg font-semibold mb-4">Atividades ({currentModule?.activities?.length || 0})</h2>
                {currentModule?.activities && currentModule.activities.length > 0 ? (
                  <div className="space-y-2">
                    {currentModule.activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                          <div>
                            <p className="font-medium">{activity.question}</p>
                            <p className="text-sm text-muted-foreground">{activity.type}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Posição: {activity.pivot?.position || index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma atividade adicionada ainda.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

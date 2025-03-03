import Container from '@/components/Container'
import ModuleActivityList from '@/components/module/activity/ModuleActivityList'
import ModuleCard from '@/components/module/ModuleCard'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Activity } from '@/models/activity'
import Module from '@/models/module'
import { Head, Link, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

interface ModuleManagementPageProps {
  modules: Module[]
}

export default function ModuleManagementPage({ modules }: ModuleManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModules = useMemo(() => {
    return modules.filter(
      (module) => module.name.toLowerCase().includes(searchTerm.toLowerCase()) || module.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [modules, searchTerm])

  const handleEdit = (module: Module) => {
    router.visit(route('modules.edit', module.id))
  }

  const handleDelete = (module: Module) => {
    router.delete(route('modules.destroy', module.id), {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const handleMove = (module: Module, activity: Activity, direction: 'up' | 'down') => {
    router.post(
      route(`modules.activities.move-${direction}`, [module.id, activity.id]),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    )
  }

  return (
    <>
      <Head title="Trilhas" />

      <Container compact>
        <div className="pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Trilhas</h1>
              <p className="text-muted-foreground mt-1">Gerencie todas as suas trilhas aqui.</p>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar searchTerm={searchTerm} placeholder="Buscar trilhas..." onSearchChange={setSearchTerm} />

              <Button asChild>
                <Link href={route('modules.create')}>
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} onDelete={handleDelete} onEdit={handleEdit}>
              <ModuleActivityList module={module} onMove={handleMove} />
            </ModuleCard>
          ))}

          {filteredModules.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              {modules.length === 0 ? 'Nenhuma trilha disponível.' : `Nenhuma trilha encontrada para "${searchTerm}".`}
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

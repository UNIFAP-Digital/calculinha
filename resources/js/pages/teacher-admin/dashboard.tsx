import { Head } from '@inertiajs/react'

export default function Dashboard() {
  return (
    <>
      <Head title="Painel do Professor" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
              <p>Gerencie suas turmas, módulos e atividades.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

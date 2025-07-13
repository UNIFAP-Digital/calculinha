import { Head } from '@inertiajs/react'
import TeacherLayout from '@/components/layouts/TeacherLayout'

export default function TeacherDashboard() {
  return (
    <>
      <Head title="Dashboard do Professor" />
      <TeacherLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard do Professor</h1>
          
          <div className="grid gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Bem-vindo ao Painel de Controle</h2>
              <p className="text-gray-600">
                Aqui você pode gerenciar suas salas, módulos e atividades.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900">Salas</h3>
                <p className="text-blue-700">Gerencie suas salas de aula</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900">Módulos</h3>
                <p className="text-green-700">Organize seus conteúdos</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900">Atividades</h3>
                <p className="text-purple-700">Crie quizzes e exercícios</p>
              </div>
            </div>
          </div>
        </div>
      </TeacherLayout>
    </>
  )
}

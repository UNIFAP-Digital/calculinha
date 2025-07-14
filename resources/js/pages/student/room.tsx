import { Head, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, Award, CheckCircle, ClipboardCheck, Divide, Lock, Minus, Plus, Star, X } from 'lucide-react'
import { useState } from 'react'

import type { Module, Room } from '@/models'
import type { Status } from '@/models/status'

interface RoomPageProps {
  room: Room
  modules: Module[]
  attempt: {
    id: number
    current_activity_id: number | null
    score: number
    time_spent: number
    finished_at: string | null
  }
}

// Color configuration for different module types
const MODULE_COLORS = {
  'pre-test': {
    name: 'Pré-Teste',
    color: '#3B82F6', // Blue
    gradient: 'from-blue-500 to-blue-600',
    icon: ClipboardCheck,
  },
  'post-test': {
    name: 'Pós-Teste',
    color: '#3B82F6', // Blue
    gradient: 'from-blue-500 to-blue-600',
    icon: Award,
  },
  exercise: {
    addition: {
      name: 'Adição',
      color: '#10B981', // Green
      gradient: 'from-green-500 to-green-600',
      icon: Plus,
    },
    subtraction: {
      name: 'Subtração',
      color: '#8B5CF6', // Purple
      gradient: 'from-purple-500 to-purple-600',
      icon: Minus,
    },
    multiplication: {
      name: 'Multiplicação',
      color: '#EF4444', // Red
      gradient: 'from-red-500 to-red-600',
      icon: X,
    },
    division: {
      name: 'Divisão',
      color: '#F59E0B', // Amber
      gradient: 'from-amber-500 to-amber-600',
      icon: Divide,
    },
  },
}

const STATUS_CONFIG: Record<Status, { icon: React.ElementType; text: string; color: string }> = {
  current: { icon: ArrowRight, text: 'Em andamento', color: 'text-white' },
  locked: { icon: Lock, text: 'Bloqueado', color: 'text-gray-400' },
  completed: { icon: CheckCircle, text: 'Completado', color: 'text-white' },
}

export default function RoomPage({ room, modules }: RoomPageProps) {
  const handleModuleClick = (moduleId: number) => {
    router.visit(route('quiz.show', [room.id, moduleId]))
  }

  console.log("Modules:", modules);

  if (!modules?.length) {
    return (
      <>
        <Head title="Sala de Aula" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Nenhum módulo disponível
            </h1>
            <p className="text-gray-600">
              Entre em contato com o professor para adicionar módulos.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title={`Sala: ${room.name}`} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <motion.header
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              {room.name}
            </h1>
            <p className="text-gray-600">
              Complete os módulos para avançar no aprendizado
            </p>
          </motion.header>

          <div className="mx-auto max-w-2xl">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                onClick={handleModuleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

interface ModuleCardProps {
  module: Module
  index: number
  onClick: (moduleId: number) => void
}

function ModuleCard({ module, index, onClick }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const status = module.status ?? 'locked'
  const completedActivities = module.activities_completed ?? 0
  const activitiesCount = module.activities_count ?? 0
  const progressPercentage = activitiesCount > 0 ? (completedActivities / activitiesCount) * 100 : 0

  const isClickable = status === 'current' || status === 'completed'
  
  // Get color configuration based on module type and operation
  const getModuleConfig = () => {
    if (module.type === 'pre-test' || module.type === 'post-test') {
      return MODULE_COLORS[module.type]
    }
    
    if (module.type === 'exercise' && module.operation && module.operation !== 'all') {
      return MODULE_COLORS.exercise[module.operation]
    }
    
    return MODULE_COLORS.exercise.addition // fallback
  }

  const config = getModuleConfig()
  const statusInfo = STATUS_CONFIG[status]

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}>
      
      {/* Section dividers */}
      {module.type === 'pre-test' && index > 0 && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-3 text-sm font-medium text-gray-500">
              OPERAÇÕES MATEMÁTICAS
            </span>
          </div>
        </div>
      )}
      
      {module.type === 'post-test' && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-3 text-sm font-medium text-gray-500">
              AVALIAÇÃO FINAL
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Module number */}
        <div className="flex-shrink-0">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg ${config.gradient}`}>
            {index + 1}
          </div>
        </div>

        {/* Module content */}
        <div className="flex-1">
          <motion.div
            className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-200 ${isClickable ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed opacity-75'}`}
            onClick={() => isClickable && onClick(module.id)}
            onHoverStart={() => isClickable && setIsHovered(true)}
            onHoverEnd={() => isClickable && setIsHovered(false)}
            whileHover={{ scale: isClickable ? 1.02 : 1 }}
            whileTap={{ scale: isClickable ? 0.98 : 1 }}>
            
            <div className={`p-5 ${config.gradient} bg-gradient-to-r`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <config.icon className="h-6 w-6 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      {module.name ?? config.name}
                    </h3>
                  </div>
                  
                  <p className="mt-1 text-sm text-white/90">
                    {module.description ?? `Módulo de ${config.name.toLowerCase()}`}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                      <statusInfo.icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </div>
                    
                    {status === 'completed' && (
                      <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                        <Star className="h-3 w-3" />
                        <span>{module.score} / {activitiesCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isClickable && (
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}>
                    <ArrowRight className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            {activitiesCount > 0 && (
              <div className="bg-white/10 px-5 py-3">
                <div className="flex items-center justify-between text-sm text-white/90">
                  <span>Progresso</span>
                  <span>{completedActivities} / {activitiesCount}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full bg-white/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

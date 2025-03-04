import { Attempt, Room, Student } from '@/models'
import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, Award, CheckCircle, ClipboardCheck, Divide, LockIcon as LockClosed, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'

const colorThemes = [
  {
    name: 'Pré-Teste',
    color: '#5ebbff',
    gradientStart: '#5ebbff',
    gradientEnd: '#3d9dff',
    baseColor: '#2a85e5',
    icon: ClipboardCheck,
    description: 'Avaliação inicial de conhecimentos',
    isSpecial: true,
  },
  {
    name: 'Adição',
    color: '#20e4bc',
    gradientStart: '#20e4bc',
    gradientEnd: '#0fbf96',
    baseColor: '#0aa582',
    icon: Plus,
    description: 'Aprenda a somar números',
    isSpecial: false,
  },
  {
    name: 'Subtração',
    color: '#a18cff',
    gradientStart: '#a18cff',
    gradientEnd: '#7c5cff',
    baseColor: '#6a4aef',
    icon: Minus,
    description: 'Pratique a subtração de valores',
    isSpecial: false,
  },
  {
    name: 'Multiplicação',
    color: '#ff7e7e',
    gradientStart: '#ff7e7e',
    gradientEnd: '#ff5252',
    baseColor: '#e64545',
    icon: X,
    description: 'Multiplique números facilmente',
    isSpecial: false,
  },
  {
    name: 'Divisão',
    color: '#ffcf5e',
    gradientStart: '#ffcf5e',
    gradientEnd: '#ffb72a',
    baseColor: '#e59e1a',
    icon: Divide,
    description: 'Aprenda a dividir valores',
    isSpecial: false,
  },
  {
    name: 'Pós-Teste',
    color: '#ff7ad9',
    gradientStart: '#ff7ad9',
    gradientEnd: '#ff42c0',
    baseColor: '#e032a8',
    icon: Award,
    description: 'Avaliação final de conhecimentos',
    isSpecial: true,
  },
]

export interface GameSelectPageProps {
  room: Room
  student: Student
  attempt: Attempt
}

export function QuizIndexPage({ room, attempt }: GameSelectPageProps) {
  if (attempt.modules.length === 0) {
    return (
      <>
        <Head title="Jogar" />
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-[#4B4B4B]">Nenhuma operação disponível</h1>
            <p className="text-xl text-[#777777]">Entre em contato com o administrador para adicionar operações.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Jogar" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.header className="mb-12 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-800 md:text-5xl">Jornada Matemática</h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">Complete cada módulo para desbloquear o próximo e avançar na sua jornada de aprendizado.</p>
          </motion.header>

          <div className="mx-auto max-w-3xl">
            {attempt.modules.map((module, index) => (
              <ModuleIntroCard
                key={module.id}
                module={module}
                index={index}
                totalModules={attempt.modules.length}
                currentModuleIndex={attempt.currentModuleIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const mockData = {
  room: { id: 1, name: 'Sala de Matemática' },
  attempt: {
    currentModuleIndex: 2, // Usuário está no módulo de subtração (índice 2)
    modules: colorThemes.map((theme, index) => ({
      id: index + 1,
      name: theme.name,
      description: theme.description,
      color: theme.color,
      icon: theme.name.charAt(0),
      isSpecial: theme.isSpecial,
      status: index < 2 ? 'completed' : index === 2 ? 'current' : 'locked',
      activities: Array(Math.floor(Math.random() * 3) + 3)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `Atividade ${i + 1}`,
          completed: index < 2 ? true : index === 2 ? i < 1 : false,
        })),
    })),
  },
}

// Componente para ícone "gordinho" sem o glow branco
function FatIcon({ icon: Icon, color, size = 24, className = '', status = 'current' }) {
  // Cores baseadas no status
  const iconColor = 'white'
  let bgColor = color

  if (status === 'locked') {
    bgColor = '#9CA3AF' // Cinza para módulos bloqueados
  } else if (status === 'completed') {
    // Manter a cor original para completados
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))' }}>
      {/* Base shadow for 3D effect */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 4,
          height: size + 4,
          background: bgColor,
          opacity: 0.7,
          transform: 'translateY(3px)',
          filter: 'blur(2px)',
        }}
      />

      {/* Icon background */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 8,
          height: size + 8,
          background: bgColor,
        }}
      />

      {/* Icon itself */}
      <div className="relative z-10">
        <Icon size={size} strokeWidth={3} color={iconColor} />
      </div>
    </div>
  )
}

function ModuleIntroCard({ module, index, totalModules, currentModuleIndex }) {
  const [isHovered, setIsHovered] = useState(false)

  // Determinar status do módulo
  const status = module.status // "completed", "current", ou "locked"

  // Calcular progresso
  const completedActivities = module.activities.filter((a) => a.completed).length
  const progressPercentage = (completedActivities / module.activities.length) * 100

  // Determinar se o texto deve ser claro ou escuro
  const isLight = (color) => {
    const hex = color.replace('#', '')
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    return r * 0.299 + g * 0.587 + b * 0.114 > 186
  }

  // Ajustar cores baseadas no status
  let cardColor = module.color
  let cardGradientStart = module.color
  let cardGradientEnd = colorThemes.find((t) => t.name === module.name)?.baseColor || module.color
  let textColor = isLight(module.color) ? '#000000' : '#FFFFFF'

  if (status === 'locked') {
    cardColor = '#9CA3AF'
    cardGradientStart = '#9CA3AF'
    cardGradientEnd = '#6B7280'
    textColor = '#FFFFFF'
  } else if (status === 'completed') {
    // Manter as cores originais para completados, mas com opacidade reduzida
    cardGradientStart = module.color
    cardGradientEnd = colorThemes.find((t) => t.name === module.name)?.baseColor || module.color
  }

  // Ícone correspondente
  const IconComponent = colorThemes.find((t) => t.name === module.name)?.icon || Plus

  // Ícone de status
  const StatusIcon = status === 'completed' ? CheckCircle : status === 'locked' ? LockClosed : ArrowRight

  // Verificar se é um módulo especial (Pré-Teste ou Pós-Teste)
  const isSpecial = module.isSpecial

  // Determinar se este módulo é o primeiro do grupo de operações matemáticas
  const isFirstMathModule = index === 1 // Índice 1 é o primeiro após o Pré-Teste

  // Determinar se este módulo é o último do grupo de operações matemáticas
  const isLastMathModule = index === totalModules - 2 // Penúltimo módulo (antes do Pós-Teste)

  // Determinar se o módulo é interativo
  const isInteractive = status === 'current'

  return (
    <motion.div
      className={`mb-8 ${isSpecial ? 'relative z-10' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Separador visual para agrupar os módulos matemáticos */}
      {isFirstMathModule && (
        <div className="relative mt-12 mb-8">
          <div className="absolute right-6 left-6 h-0.5 bg-gray-200"></div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm font-medium text-gray-500">OPERAÇÕES MATEMÁTICAS</span>
          </div>
        </div>
      )}

      <div className="mb-2 flex items-center">
        {/* Número do módulo */}
        <div className="relative mr-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
              status === 'locked' ? 'opacity-60' : ''
            } ${status === 'completed' ? 'opacity-80' : ''} ${isSpecial ? 'border-2 border-white' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${cardGradientStart}, ${cardGradientEnd})`,
              color: textColor,
              boxShadow: isSpecial ? '0 0 0 4px rgba(0,0,0,0.05)' : '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {index + 1}
          </div>

          {/* Linha conectora */}
          {index < totalModules - 1 && (
            <div
              className={`absolute top-12 left-1/2 w-1 -translate-x-1/2 ${status === 'locked' ? 'opacity-30' : ''}`}
              style={{
                height: isLastMathModule ? '60px' : '40px',
                background:
                  status === 'completed'
                    ? `linear-gradient(to bottom, ${module.color} 0%, ${mockData.attempt.modules[index + 1].color} 100%)`
                    : `linear-gradient(to bottom, ${cardColor} 0%, rgba(200,200,200,0.3) 100%)`,
                zIndex: -1,
              }}
            />
          )}
        </div>

        {/* Card do módulo */}
        <motion.div
          className="flex-1"
          whileHover={{ scale: isInteractive ? 1.02 : 1 }}
          onHoverStart={() => isInteractive && setIsHovered(true)}
          onHoverEnd={() => isInteractive && setIsHovered(false)}
        >
          <motion.div
            className={`relative overflow-hidden rounded-2xl p-5 shadow-lg ${
              status === 'locked' ? 'cursor-not-allowed opacity-70' : ''
            } ${status === 'completed' ? 'cursor-default opacity-85' : ''} ${isInteractive ? 'cursor-pointer' : ''} ${
              isSpecial ? 'border-2 border-white' : ''
            }`}
            style={{
              background: `linear-gradient(135deg, ${cardGradientStart}, ${cardGradientEnd})`,
              boxShadow: isSpecial ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 10px rgba(0,0,0,0.1)',
            }}
            whileTap={{ scale: isInteractive ? 0.98 : 1 }}
          >
            {/* Overlay para módulos completados */}
            {status === 'completed' && <div className="pointer-events-none absolute inset-0 bg-black opacity-10"></div>}

            {/* Padrão de fundo */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none"/><circle cx="20" cy="20" r="3" fill="white"/><circle cx="60" cy="20" r="3" fill="white"/><circle cx="20" cy="60" r="3" fill="white"/><circle cx="60" cy="60" r="3" fill="white"/><circle cx="40" cy="40" r="3" fill="white"/><circle cx="80" cy="40" r="3" fill="white"/><circle cx="40" cy="80" r="3" fill="white"/><circle cx="80" cy="80" r="3" fill="white"/></svg>\')',
                backgroundSize: '30px 30px',
              }}
            />

            <div className="flex items-center">
              {/* Ícone */}
              <div className="mr-4">
                <FatIcon icon={IconComponent} color={colorThemes.find((t) => t.name === module.name)?.baseColor || '#333'} size={32} status={status} />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: textColor }}>
                  {module.name}
                </h2>
                <p className="text-sm opacity-90" style={{ color: textColor }}>
                  {module.description}
                </p>

                {/* Status badge */}
                <div
                  className="mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: status === 'completed' ? 'rgba(255,255,255,0.3)' : status === 'locked' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                    color: textColor,
                  }}
                >
                  {status === 'completed' ? 'Completado' : status === 'locked' ? 'Bloqueado' : 'Em andamento'}
                </div>
              </div>

              <motion.div animate={{ x: isHovered && isInteractive ? 5 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <StatusIcon color={textColor} size={24} />
              </motion.div>
            </div>
          </motion.div>

          {/* Barra de progresso */}
          <div className="mt-3 px-1">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 flex-1 overflow-hidden rounded-full bg-gray-200 ${
                  status === 'locked' ? 'opacity-50' : ''
                } ${status === 'completed' ? 'opacity-80' : ''}`}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: cardColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              <div
                className={`rounded-full px-2 py-1 text-xs font-bold shadow-sm ${
                  status === 'locked' ? 'opacity-50' : ''
                } ${status === 'completed' ? 'opacity-80' : ''}`}
                style={{ backgroundColor: cardColor, color: textColor }}
              >
                {completedActivities} de {module.activities.length}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Separador visual após o último módulo matemático */}
      {isLastMathModule && (
        <div className="relative mt-12 mb-8">
          <div className="absolute right-6 left-6 h-0.5 bg-gray-200"></div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm font-medium text-gray-500">AVALIAÇÃO FINAL</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

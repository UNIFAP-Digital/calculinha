import { cn } from '@/utils/ui'

interface AppLogoProps {
  className?: string
  iconSize?: 'sm' | 'md' | 'lg'
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white'
}

export function AppLogo({ 
  className, 
  iconSize = 'md', 
  textSize = 'md',
  variant = 'default'
}: AppLogoProps) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-10 w-10'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  const textColor = variant === 'white' ? 'text-white' : 'text-blue-600 dark:text-blue-400'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/favicon.svg"
        alt="Logo Calculinha"
        className={cn('transition-transform duration-300 hover:rotate-6', iconSizes[iconSize])}
      />
      <h1 className={cn(
        'font-fredoka font-bold',
        textSizes[textSize],
        textColor
      )}>
        Calculinha
      </h1>
    </div>
  )
}
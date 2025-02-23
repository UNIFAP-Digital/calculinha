import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { FlashMessageProps, FlashMessageType } from '@/types/flash'
import { usePage } from '@inertiajs/react'
import { X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

export default function FlashMessage({ persistent = false, position = 'top-right', duration = 5000, onClose }: FlashMessageProps) {
  const page = usePage()
  const flash = page.props.flash

  const clearFlash = useCallback(() => {
    if (onClose) onClose()
    if (flash?.type) {
      page.props.flash = {
        type: flash.type,
        message: null,
        title: flash.title,
      }
    }
  }, [flash, onClose, page.props])

  useEffect(() => {
    if (!persistent && flash?.message) {
      const timer = setTimeout(clearFlash, duration)
      return () => clearTimeout(timer)
    }
  }, [flash?.message, persistent, duration, clearFlash])

  const getPositionClasses = useCallback((): string => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }, [position])

  const getAlertStyle = useCallback((type: FlashMessageType): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-900 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-900 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200'
      default:
        return 'bg-blue-50 text-blue-900 border-blue-200'
    }
  }, [])

  // Verificações de segurança
  if (!flash?.message || !flash?.type) return null

  return (
    <div className={`fixed ${getPositionClasses()} z-50 max-w-md animate-in fade-in slide-in-from-top-2`}>
      <Alert className={`${getAlertStyle(flash.type)} flex items-center justify-between`}>
        <div>
          <AlertTitle className="text-lg font-semibold">
            {flash.title || (flash.type === 'success' ? 'Sucesso!' : flash.type === 'error' ? 'Erro!' : flash.type === 'warning' ? 'Atenção!' : 'Informação')}
          </AlertTitle>
          <AlertDescription className="mt-1">{flash.message}</AlertDescription>
        </div>
        <button onClick={clearFlash} className="ml-4 rounded-full p-1 hover:bg-black/5" type="button" aria-label="Fechar mensagem">
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  )
}

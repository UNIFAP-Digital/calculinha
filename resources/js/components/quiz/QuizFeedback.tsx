import { cn } from '@/utils/ui'
import { CircleArrowRight } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'

type ToastType = 'correct' | 'incorrect'

interface ToastProps {
  id: string | number
  message: string
  type: ToastType
  button: {
    onClick: () => void
  }
}

export function quizToast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => <Toast id={id} {...toast} />, {
    duration: Infinity,
  })
}

function Toast({ message, type, id, button }: ToastProps) {
  const handleClick = () => {
    button.onClick()
    sonnerToast.dismiss(id)
  }

  return (
    <div
      className={cn(
        'flex h-20 w-screen items-center bg-white shadow-lg ring-1 ring-black/5 sm:h-20',
        type === 'correct' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'shrink-0 rounded-md text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-hidden',
          'grid h-full w-full grid-cols-[1fr_auto_1fr] items-center',
        )}
      >
        <p className="col-[2] font-extrabold tracking-wide text-white uppercase sm:text-xl">{message}</p>
        <button
          className={cn(
            'col-[3] flex h-full items-center justify-end gap-1 justify-self-end px-1 py-1 text-xs font-semibold capitalize sm:gap-2 sm:px-10 sm:text-lg',
            type === 'correct' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200',
          )}
        >
          Próxima
          <CircleArrowRight className={cn(type === 'correct' ? 'text-green-500' : 'text-red-500', 'size-4 sm:size-8')} />
        </button>
      </div>
    </div>
  )
}

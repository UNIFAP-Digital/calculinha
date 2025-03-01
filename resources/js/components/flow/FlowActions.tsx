import DeleteAlertDialog from '@/components/DeleteAlertDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/ui'
import { ChevronDown, Pencil } from 'lucide-react'

interface FlowActionsProps {
  flowName: string
  isExpanded: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleExpand: () => void
}

export default function FlowActions({ flowName, isExpanded, onEdit, onDelete, onToggleExpand }: FlowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="h-8 px-2 py-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <DeleteAlertDialog
          size="sm"
          variant="ghost"
          className="h-8 px-2 py-0"
          description={'Esta ação não pode ser desfeita. Isso irá apagar permanentemente a trilha ' + flowName + ' e todas os recursos vinculados.'}
          onConfirmDelete={onDelete}
        />
      </div>

      <ChevronDown className={cn('h-5 w-5 cursor-pointer transition-transform', isExpanded && 'rotate-180')} onClick={onToggleExpand} />
    </div>
  )
}

import DeleteAlertDialog from '@/components/DeleteAlertDialog'
import { Button } from '@/components/ui/button'
import Flow from '@/models/flow'
import { cn } from '@/utils/ui'
import { ChevronDown, MoveDown, MoveUp, Pencil } from 'lucide-react'

interface FlowActionsProps {
  flow: Flow
  isExpanded: boolean
  onEdit?: (flow: Flow) => void
  onDelete?: (flow: Flow) => void
  onMove?: (flow: Flow, direction: 'up' | 'down') => void
  isFirst?: boolean
  isLast?: boolean
  onToggleExpand: () => void
}

export function FlowActions({ flow, isLast, isFirst, isExpanded, onEdit, onDelete, onMove, onToggleExpand }: FlowActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(flow)}>
            <Pencil />
          </Button>
        )}

        {onDelete && (
          <DeleteAlertDialog
            size="sm"
            variant="ghost"
            description={'Esta ação não pode ser desfeita. Isso irá apagar permanentemente a trilha ' + flow.name + ' e todas as suas atividades.'}
            onConfirmDelete={() => onDelete(flow)}
          />
        )}

        <Button variant="ghost" size="sm" onClick={onToggleExpand}>
          <ChevronDown className={cn('transition-transform', isExpanded && 'rotate-180')} onClick={onToggleExpand} />
        </Button>
      </div>

      {onMove && isFirst !== undefined && isLast !== undefined && (
        <div className="flex flex-col border-s ps-4">
          <Button variant="ghost" size="sm" disabled={isFirst} onClick={() => onMove(flow, 'up')}>
            <MoveUp />
          </Button>
          <Button variant="ghost" size="sm" disabled={isLast} onClick={() => onMove(flow, 'down')}>
            <MoveDown />
          </Button>
        </div>
      )}
    </div>
  )
}

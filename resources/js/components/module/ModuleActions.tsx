import DestructiveActionAlertDialog from '@/components/DestructiveActionAlertDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/ui'
import { ChevronDown, MoveDown, MoveUp, Pencil } from 'lucide-react'
import { Module } from '@/models'

interface ModuleActionsProps {
  module: Module
  isExpanded: boolean
  onEdit?: (module: Module) => void
  onDelete?: (module: Module) => void
  onMove?: (module: Module, direction: 'up' | 'down') => void
  isFirst?: boolean
  isLast?: boolean
  onToggleExpand: () => void
}

export function ModuleActions({ module, isLast, isFirst, isExpanded, onEdit, onDelete, onMove, onToggleExpand }: ModuleActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(module)}>
            <Pencil />
          </Button>
        )}

        {onDelete && (
          <DestructiveActionAlertDialog
            size="sm"
            variant="ghost"
            description={'Esta ação não pode ser desfeita. Isso irá apagar permanentemente a trilha ' + module.name + ' e todas as suas atividades.'}
            onConfirm={() => onDelete(module)}
          />
        )}

        <Button variant="ghost" size="sm" onClick={onToggleExpand}>
          <ChevronDown className={cn('transition-transform', isExpanded && 'rotate-180')} onClick={onToggleExpand} />
        </Button>
      </div>

      {onMove && isFirst !== undefined && isLast !== undefined && (
        <div className="flex flex-col border-s ps-4">
          <Button variant="ghost" size="sm" disabled={isFirst} onClick={() => onMove(module, 'up')}>
            <MoveUp />
          </Button>
          <Button variant="ghost" size="sm" disabled={isLast} onClick={() => onMove(module, 'down')}>
            <MoveDown />
          </Button>
        </div>
      )}
    </div>
  )
}

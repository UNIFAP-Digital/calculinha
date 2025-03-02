import Flow from '@/models/flow'

interface FlowHeaderProps {
  flow: Flow
  onClick: () => void
  order?: number
}

export function FlowHeader({ flow, order, onClick }: FlowHeaderProps) {
  return (
    <div className="flex flex-1 cursor-pointer items-center justify-between" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex h-full items-center px-4 py-3" style={{ backgroundColor: `${flow.color}35` }}>
          <div className="relative">
            <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full">
              <span className="text-lg">{flow.icon}</span>
            </div>
            {order && (
              <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium">
                {order}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-1">
          <h3 className="text-foreground font-medium">{flow.name}</h3>
          <p className="text-muted-foreground text-sm">{flow.description || 'Sem descrição'}</p>
        </div>
      </div>
      <div className="self-center">
        <div className="bg-muted text-muted-foreground flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium">
          {flow.activities?.length ?? 0} {flow.activities?.length === 1 ? 'atividade' : 'atividades'}
        </div>
      </div>
    </div>
  )
}

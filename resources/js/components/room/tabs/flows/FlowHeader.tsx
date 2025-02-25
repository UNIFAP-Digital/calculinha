import { Flow } from '@/models/flow'

interface FlowHeaderProps {
  flow: Flow
  order: number
  onClick: () => void
}

export function FlowHeader({ flow, order, onClick }: FlowHeaderProps) {
  return (
    <div className="flex flex-1 cursor-pointer items-center justify-between" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex h-full items-center px-4 py-3" style={{ backgroundColor: `${flow.color}35` }}>
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
              <span className="text-lg">{flow.icon}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {order}
            </div>
          </div>
        </div>
        <div className="px-4 py-1">
          <h3 className="font-medium text-foreground">{flow.name}</h3>
          <p className="text-sm text-muted-foreground">{flow.description || 'Sem descrição'}</p>
        </div>
      </div>
      <div className="self-center">
        <div className="flex items-center justify-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {flow.flow_activities_count ?? 0} {flow.flow_activities_count === 1 ? 'atividade' : 'atividades'}
        </div>
      </div>
    </div>
  )
}

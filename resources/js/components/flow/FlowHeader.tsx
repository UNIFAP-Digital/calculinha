import Flow from '@/models/flow'

interface FlowHeaderProps {
  flow: Flow
  onClick: () => void
}

export default function FlowHeader({ flow, onClick }: FlowHeaderProps) {
  return (
    <div className="flex flex-1 cursor-pointer items-center justify-between" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex h-full items-center px-4 py-3" style={{ backgroundColor: `${flow.color}35` }}>
          <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-lg">{flow.icon}</span>
          </div>
        </div>
        <div className="px-4 py-1">
          <h3 className="text-foreground font-medium">{flow.name}</h3>
          <p className="text-muted-foreground text-sm">{flow.description || 'Sem descrição'}</p>
        </div>
      </div>
      <div className="self-center">
        <div className="bg-muted text-muted-foreground flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium">
          {flow.flow_activities?.length ?? 0} {flow.flow_activities?.length === 1 ? 'atividade' : 'atividades'}
        </div>
      </div>
    </div>
  )
}

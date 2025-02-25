interface FlowConnectorProps {
  color?: string
}

export function FlowConnector({ color }: FlowConnectorProps) {
  const separator = color ? <div className="h-6 w-0.5" style={{ backgroundColor: color }} /> : <div className="h-6 w-0.5 bg-muted-foreground" />

  return (
    <div className="ms-8 flex">
      <div className="flex flex-col items-center">{separator}</div>
    </div>
  )
}

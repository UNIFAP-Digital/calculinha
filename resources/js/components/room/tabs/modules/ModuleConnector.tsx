interface ModuleConnectorProps {
  color?: string
}

export function ModuleConnector({ color }: ModuleConnectorProps) {
  const separator = color ? <div className="h-6 w-0.5" style={{ backgroundColor: color }} /> : <div className="bg-muted-foreground h-6 w-0.5" />

  return (
    <div className="ms-8 flex">
      <div className="flex flex-col items-center">{separator}</div>
    </div>
  )
}

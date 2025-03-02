interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
}

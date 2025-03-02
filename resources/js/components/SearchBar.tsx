import { Input } from '@/components/ui/input'
import { cn } from '@/utils/ui'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  placeholder: string
  onSearchChange: (v: string) => void
  className?: string
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder, className }: SearchBarProps) {
  return (
    <div className={cn('bg-card relative w-full rounded-md md:w-auto', className)}>
      <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
      <Input placeholder={placeholder} className="pl-8" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
  )
}

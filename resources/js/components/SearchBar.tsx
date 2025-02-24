import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  placeholder: string
  onSearchChange: (v: string) => void
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full rounded-md bg-card md:w-auto">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder={placeholder} className="pl-8" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
  )
}

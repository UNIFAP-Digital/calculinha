import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  placeholder: string
  onSearchChange: (v: string) => void
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder }: SearchBarProps) {
  return (
    <div className="bg-card relative w-full rounded-md md:w-auto">
      <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
      <Input placeholder={placeholder} className="pl-8" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
  )
}

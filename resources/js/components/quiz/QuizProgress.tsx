import { Progress } from '@/components/ui/progress'

interface QuizProgressProps {
  current: number
  total: number
  backgroundColor: string
}

export default function QuizProgress({ current, total, backgroundColor }: QuizProgressProps) {
  return <Progress value={(current / total) * 100} className={`h-3 w-full bg-[${backgroundColor}]`} />
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {motion} from 'motion/react'
import { ComponentProps, PropsWithChildren } from 'react'

interface QuizCardProps {
  title?: string
  backgroundColor: string
  animation?: ComponentProps<typeof motion.div>
}

export default function QuizCard({ title, backgroundColor, children, animation }: QuizCardProps & PropsWithChildren) {
  return (
    <motion.div className="w-full max-w-4xl" {...animation}>
      <Card style={{ backgroundColor }}>
        {title && (
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-white">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

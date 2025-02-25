import { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import '../../../css/quiz.css'

export default function QuizLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-left"
        offset={{ bottom: '0', right: '0', left: '0' }}
        mobileOffset={{ bottom: '0', right: '0', left: '0', top: 0 }}
        visibleToasts={1}
      />
    </>
  )
}

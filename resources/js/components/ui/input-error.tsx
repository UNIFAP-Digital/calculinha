import { AlertCircle } from 'lucide-react'
import { HTMLAttributes } from 'react'

export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
  return message ? (
    <p {...props} className={`text-destructive flex items-center gap-2 text-sm ${className}`}>
      <AlertCircle className="size-4" />
      {message}
    </p>
  ) : null
}

import { PropsWithChildren } from 'react'

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex self-center">
          <img src="/material/icon.png" alt="Ícone do calculinha" className="size-16 object-contain"></img>
        </div>
        {children}
      </div>
    </div>
  )
}

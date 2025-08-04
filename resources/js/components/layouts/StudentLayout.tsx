import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { router, usePage } from '@inertiajs/react'
import { LogOutIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { AppLogo } from '@/components/ui/AppLogo'

export default function StudentLayout({ children }: PropsWithChildren) {
  const { user: student } = usePage().props.auth

  const handleLogout = () => {
    router.post(route('student.logout'))
  }

  return (
    <>
      <div className="min-h-full">
        <nav className="bg-card border shadow-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <AppLogo iconSize="sm" textSize="sm" />
                </div>
              </div>

              <div className="flex items-center">
                <div className="me-3 flex flex-col items-end">
                  <span className="text-foreground text-base font-medium">
                    {student.name}
                  </span>
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <span className="sr-only">Sair</span>
                  <LogOutIcon aria-hidden="true" className="size-6" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </div>
      <Toaster />
    </>
  )
}

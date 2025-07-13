import { Toaster } from '@/components/ui/sonner'
import { Link, router, usePage } from '@inertiajs/react'
import { LogOutIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback,  } from '@/components/ui/avatar'

export default function StudentLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth?.user

  const handleLogout = () => {
    router.post('/logout')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm dark:bg-gray-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo and Title */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-2">
                  <img alt="Calculinha" src="/favicon.svg" className="h-8 w-8" />
                  <span className="font-fredoka text-xl font-bold text-blue-600 dark:text-blue-400">
                    Calculinha
                  </span>
                </Link>
                <Link 
                  href={route('student.dashboard')}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Início
                </Link>
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {user ? getInitials(user.name) : '??'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

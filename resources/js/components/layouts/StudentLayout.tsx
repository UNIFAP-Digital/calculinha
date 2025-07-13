import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Link, router, usePage } from '@inertiajs/react'
import { BookOpenIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

const studentNavigation = [
  { name: 'Minhas Salas', route: 'student.rooms.index', icon: BookOpenIcon },
  { name: 'Perfil', route: 'student.profile', icon: UserIcon },
]

export default function StudentLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth?.user

  const handleLogout = () => {
    router.post('/sair')
  }

  return (
    <>
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm dark:bg-gray-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <img alt="Calculinha" src="/favicon.svg" className="h-8 w-8" />
                  <span className="font-fredoka text-xl font-bold text-blue-600 dark:text-blue-400">
                    Calculinha
                  </span>
                </Link>
              </div>

              {/* Navigation */}
              <div className="hidden sm:flex sm:space-x-8">
                {studentNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={route(item.route)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Olá, {user.name}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  <LogOutIcon className="h-4 w-4" />
                </Button>
              </div>
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

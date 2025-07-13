import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/utils/ui'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Link, router, usePage } from '@inertiajs/react'
import { GroupIcon, LogOutIcon, MenuIcon, Monitor, Moon, ShapesIcon, Sun, WorkflowIcon, XIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { PropsWithChildren } from 'react'

const teacherNavigation = [
  { name: 'Salas', route: 'rooms.index', icon: GroupIcon },
  { name: 'Trilhas', route: 'modules.index', icon: WorkflowIcon },
  { name: 'Atividades', route: 'activities.index', icon: ShapesIcon },
]

export default function TeacherLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth?.user
  const { theme, setTheme } = useTheme()

  const handleToggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-card border shadow-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* APPLICATION LOGO */}
                <div className="flex shrink-0 items-center">
                  <Link href="/">
                    <img alt="Calculinha" src="/material/icon.png" className="block h-8 w-auto" />
                  </Link>
                </div>

                {/* MENU */}
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {teacherNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={route(item.route)}
                      aria-current={route().current() == item.route ? 'page' : undefined}
                      className={cn(
                        route().current() == item.route
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                        'inline-flex items-center gap-x-2 border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                    >
                      <item.icon className="size-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* USER MENU & THEME TOGGLE */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="size-4" />
                  ) : theme === 'dark' ? (
                    <Monitor className="size-4" />
                  ) : (
                    <Sun className="size-4" />
                  )}
                </Button>

                <div className="flex items-center gap-x-2">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user?.name}</div>
                    <div className="text-muted-foreground">{user?.email}</div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOutIcon className="size-4" />
                </Button>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                  <XIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {teacherNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={route(item.route)}
                  aria-current={route().current() == item.route ? 'page' : undefined}
                  className={cn(
                    route().current() == item.route
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    <item.icon className="size-4" />
                    {item.name}
                  </div>
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-border pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{user?.name}</div>
                  <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <DisclosureButton
                  as={Button}
                  variant="ghost"
                  onClick={handleLogout}
                  className="block w-full text-left"
                >
                  Sair
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

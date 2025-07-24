import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/utils/ui'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Link, router, usePage } from '@inertiajs/react'
import {
  GroupIcon,
  LogOutIcon,
  MenuIcon,
  Monitor,
  Moon,
  ShapesIcon,
  Sun,
  WorkflowIcon,
  XIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { PropsWithChildren } from 'react'

const navigation = [
  { name: 'Salas', route: 'rooms.index', icon: GroupIcon },
  { name: 'Trilhas', route: 'modules.index', icon: WorkflowIcon },
  { name: 'Atividades', route: 'activities.index', icon: ShapesIcon },
]

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth.user
  const { theme, setTheme } = useTheme()

  const handleToggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const handleLogout = () => {
    router.post('/sair', {
      onSuccess() {},
    })
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
                  <img
                    alt="Calculinha"
                    src="/material/icon.png"
                    className="block h-8 w-auto"
                  />
                </div>

                {/* MENU */}
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={route(item.route)}
                      aria-current={
                        route().current() === item.route ? 'page' : undefined
                      }
                      className={cn(
                        route().current() === item.route
                          ? 'border-primary text-primary'
                          : 'text-muted-foreground hover:text-primary border-transparent',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                      )}
                    >
                      <item.icon className="size-5" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="me-3 flex flex-col items-end">
                  <span className="text-foreground text-base font-medium">
                    {user.name}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {user.email}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleTheme}
                  className="mr-2"
                >
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {theme === 'system'
                      ? 'Usar tema do sistema'
                      : `Usar tema ${theme}`}
                  </span>
                </Button>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <span className="sr-only">Sair</span>
                  <LogOutIcon aria-hidden="true" className="size-6" />
                </Button>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="flex items-center sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleTheme}
                  className="mr-2"
                >
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {theme === 'system'
                      ? 'Usar tema do sistema'
                      : `Usar tema ${theme}`}
                  </span>
                </Button>

                <DisclosureButton
                  as={Button}
                  variant="ghost"
                  size="icon"
                  className="group"
                >
                  <span className="sr-only">Abrir menu principal</span>
                  <MenuIcon
                    aria-hidden="true"
                    className="block group-data-open:hidden"
                  />
                  <XIcon
                    aria-hidden="true"
                    className="hidden group-data-open:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={route(item.route)}
                  aria-current={
                    route().current() === item.route ? 'page' : undefined
                  }
                  className={cn(
                    route().current() === item.route
                      ? 'border-primary bg-muted text-primary'
                      : 'text-muted-foreground hover:text-primary border-transparent',
                    'block border-l-4 py-2 pr-4 pl-3 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="px-4">
                <div className="text-foreground text-base font-medium">
                  {user.name}
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  {user.email}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <DisclosureButton
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-primary block px-4 py-2 text-base font-medium"
                >
                  Sair
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {children}
      </div>
      <Toaster />
    </>
  )
}

import { Button, buttonVariants } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Link, usePage } from '@inertiajs/react'
import { clsx } from 'clsx'
import { GroupIcon, LogOutIcon, MenuIcon, ShapesIcon, XIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

const navigation = [
  { name: 'Salas', route: 'rooms.index', icon: GroupIcon },
  { name: 'Atividades', route: 'question.index', icon: ShapesIcon },
]

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth.user
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border bg-card shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* APPLICATION LOGO */}
                <div className="flex shrink-0 items-center">
                  <img alt="Calculinha" src="/material/icon.png" className="block h-8 w-auto" />
                </div>

                {/* MENU */}
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={route(item.route)}
                      aria-current={route().current() == item.route ? 'page' : undefined}
                      className={clsx(
                        route().current() == item.route ? 'text- border-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
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
                  <span className="text-base font-medium text-gray-800">{user.name}</span>
                  <span className="text-sm font-medium text-muted-foreground">{user.email}</span>
                </div>

                <Link className={buttonVariants({ variant: 'ghost', size: 'icon' })} href={route('logout')}>
                  <span className="sr-only">Sair</span>
                  <LogOutIcon aria-hidden="true" className="size-6" />
                </Link>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="flex items-center sm:hidden">
                <DisclosureButton as={Button} variant="ghost" size="icon" className="group">
                  <span className="sr-only">Abrir menu principal</span>
                  <MenuIcon aria-hidden="true" className="block group-data-[open]:hidden" />
                  <XIcon aria-hidden="true" className="hidden group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={route(item.route)}
                  aria-current={route().current() == item.route ? 'page' : undefined}
                  className={clsx(
                    route().current() == item.route
                      ? 'border-primary bg-muted text-primary'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
              </div>

              <div className="mt-3 space-y-1">
                <DisclosureButton
                  as="a"
                  href={route('logout')}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
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

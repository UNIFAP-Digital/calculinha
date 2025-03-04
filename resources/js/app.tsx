import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import GuestLayout from '@/components/layouts/GuestLayout'
import InertiaCustomApp from '@/lib/inertia'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then((module) => {
      const typedModule = module as { default: { layout: (page: ReactNode) => ReactNode; theme?: string } }

      if (name === 'Welcome') {
        typedModule.default.theme = 'light'
      } else if (name.startsWith('auth/')) typedModule.default.layout = (page) => <GuestLayout>{page}</GuestLayout>
      else if (name.startsWith('quiz/')) {
        typedModule.default.theme = 'light'
      } else typedModule.default.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>
      return typedModule
    }),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<InertiaCustomApp App={App} props={props} />)
  },
  progress: {
    color: '#3B82F6',
  },
}).then()

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import GuestLayout from '@/components/layouts/GuestLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { usePage } from '@inertiajs/react'
import '../css/app.css'


function CSRFTokenUpdater() {
  const { props } = usePage()
  const csrfToken = (props as any).csrf_token

  useEffect(() => {
    if (csrfToken) {
      const metaTag = document.querySelector('meta[name="csrf-token"]')
      if (metaTag && metaTag.getAttribute('content') !== csrfToken) {
        metaTag.setAttribute('content', csrfToken)
      }
    }
  }, [csrfToken])

  return null
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then((module) => {
      const typedModule = module as { default: { layout: (page: ReactNode) => ReactNode } }

      if (name === 'Welcome' || name.startsWith('quiz/')) {
        typedModule.default.layout = (page) => (
          <>
            <CSRFTokenUpdater />
            {page}
          </>
        )
      } else if (name.startsWith('auth/')) {
        typedModule.default.layout = (page) => (
          <GuestLayout>
            <CSRFTokenUpdater />
            {page}
          </GuestLayout>
        )
      } else {
        typedModule.default.layout = (page) => (
          <AuthenticatedLayout>
            <CSRFTokenUpdater />
            {page}
          </AuthenticatedLayout>
        )
      }
      return typedModule
    }),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: '#3B82F6',
  },
}).then()

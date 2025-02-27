import '../css/app.css'

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import GuestLayout from '@/components/layouts/GuestLayout'
import QuizLayout from '@/components/layouts/QuizLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then(
      (module) => /* eslint-disable */ {
        if (name === 'Welcome') {
          // @ts-ignore
        } else if (name.startsWith('auth/')) module.default.layout = (page) => <GuestLayout>{page}</GuestLayout>
        // @ts-ignore
        else if (name.startsWith('game/')) module.default.layout = (page) => <QuizLayout>{page}</QuizLayout>
        // @ts-ignore
        else module.default.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>
        return module
      } /* eslint-enable */,
    ),
  setup({ el, App, props }) {
    const root = createRoot(el)

    root.render(<App {...props} />)
  },
  progress: {
    color: '#3B82F6',
  },
})

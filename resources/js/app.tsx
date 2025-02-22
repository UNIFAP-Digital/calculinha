import '../css/app.css'
import './bootstrap'

import GuestLayout from '@/components/layouts/GuestLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then(
      (module) => /* eslint-disable */ {
        // @ts-ignore
        if (name.startsWith('auth/')) module.default.layout = (page) => <GuestLayout>{page}</GuestLayout>
        return module
      } /* eslint-enable */,
    ),
  setup({ el, App, props }) {
    const root = createRoot(el)

    root.render(<App {...props} />)
  },
  progress: {
    color: '#4B5563',
  },
})

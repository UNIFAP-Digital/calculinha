import GuestLayout from '@/components/layouts/GuestLayout'
import StudentLayout from '@/components/layouts/StudentLayout'
import TeacherLayout from '@/components/layouts/TeacherLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { applyLayout, createLayout, LayoutType, LayoutComponent, PageWithLayout } from '@/utils/layouts'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'


const layoutComponents: Partial<Record<LayoutType, LayoutComponent>> = {
  guest: createLayout(GuestLayout),
  'authenticated-student': createLayout(StudentLayout),
  'authenticated-teacher': createLayout(TeacherLayout),
}

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then((module) => {
      return applyLayout(module as PageWithLayout, layoutComponents, name)
    }),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: '#3B82F6',
  },
}).then()

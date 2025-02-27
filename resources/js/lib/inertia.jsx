import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

export default function InertiaCustomApp({ App, props }) {
  const [theme, setTheme] = useState(null)

  const newProps = {
    ...props,
    resolveComponent: (name) => {
      return props.resolveComponent(name).then((component) => {
        setTheme(component.theme)
        return component
      })
    },
  }

  return (
    <ThemeProvider attribute="class" forcedTheme={theme} defaultTheme="system" disableTransitionOnChange>
      <App {...newProps} />
    </ThemeProvider>
  )
}

import { useEffect, useState } from 'react'

interface UseRoomTabsProps {
  defaultTab?: string
  validTabs?: string[]
}

interface UseRoomTabsReturn {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function useRoomTabs({ defaultTab = 'participants', validTabs = ['participants', 'flows', 'statistic'] }: UseRoomTabsProps = {}): UseRoomTabsReturn {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '')
    return validTabs.includes(hash) ? hash : defaultTab
  })

  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (validTabs.includes(hash)) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [validTabs])

  return {
    activeTab,
    setActiveTab,
  }
}

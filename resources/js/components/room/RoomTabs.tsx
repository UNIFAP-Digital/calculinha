import FlowsTab from '@/components/room/tabs/FlowsTab'
import ParticipantsTab from '@/components/room/tabs/ParticipantsTab'
import StatisticsTab from '@/components/room/tabs/StatisticsTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Room from '@/models/room'
import { ChartLine, Users, Workflow } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function RoomTabs({ room }: { room: Room }) {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return ['participants', 'flows', 'statistic'].includes(hash) ? hash : 'participants'
  })

  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (['participants', 'flows', 'statistic'].includes(hash)) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start overflow-auto">
        <TabsTrigger value="participants">
          <Users className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Participantes</span>
          <span className="sm:hidden">Partic.</span>
        </TabsTrigger>
        <TabsTrigger value="flows">
          <Workflow className="mr-2 h-4 w-4" />
          <span className="inline">Trilhas</span>
        </TabsTrigger>
        <TabsTrigger value="statistic">
          <ChartLine className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Estatísticas</span>
          <span className="sm:hidden">Estatí.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="participants">
        <ParticipantsTab room={room} />
      </TabsContent>

      <TabsContent value="flows">
        <FlowsTab room={room} />
      </TabsContent>

      <TabsContent value="statistic">
        <StatisticsTab />
      </TabsContent>
    </Tabs>
  )
}

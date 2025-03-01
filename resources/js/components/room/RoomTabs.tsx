import FlowsTab from '@/components/room/tabs/flows/FlowsTab'
import ParticipantsTab from '@/components/room/tabs/participants/ParticipantsTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Room from '@/models/room'
import { Users, Workflow } from 'lucide-react'

interface RoomTabsProps {
  room: Room
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function RoomTabs({ room, setActiveTab, activeTab }: RoomTabsProps) {
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
      </TabsList>

      <TabsContent value="participants">
        <ParticipantsTab room={room} />
      </TabsContent>

      <TabsContent value="flows">
        <FlowsTab room={room} />
      </TabsContent>
    </Tabs>
  )
}

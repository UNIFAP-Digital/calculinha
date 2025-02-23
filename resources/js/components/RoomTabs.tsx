import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Shapes, Users } from 'lucide-react'

export default function RoomTabs() {
  return (
    <Tabs defaultValue="participants" className="w-full">
      <TabsList className="w-full justify-start overflow-auto">
        <TabsTrigger value="participants">
          <Users className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Participantes</span>
          <span className="sm:hidden">Partic.</span>
        </TabsTrigger>
        <TabsTrigger value="activities">
          <Shapes className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Atividades</span>
          <span className="sm:hidden">Ativ.</span>
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Configurações</span>
          <span className="sm:hidden">Config.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="participants">
        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Lista de participantes da sala.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Atividades disponíveis na sala.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configurações da sala.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

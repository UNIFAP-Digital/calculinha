import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BookOpen, Clock, Trophy, PlusCircle } from 'lucide-react'

interface Room {
  id: number
  name: string
  invite_code: string
  progress?: {
    score: number
    completed: boolean
    time_spent: number
  }
}

interface PageProps {
  rooms: Room[]
}

export default function StudentDashboard({ rooms }: PageProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteCode.trim()) return

        setIsJoining(true)
        setError('')
        setSuccess('')
        
        router.post('/student/join', 
            { invite_code: inviteCode.trim() },
            {
                onSuccess: () => {
                    setInviteCode('')
                },
                onError: (errors) => {
                    setError(errors.invite_code || 'Código de convite inválido ou sala não encontrada.')
                },
                onFinish: () => {
                    setIsJoining(false)
                }
            }
        )
    }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <Head title="Painel do Aluno" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/material/logo.png" 
              alt="Calculinha" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel do Aluno
            </h1>
            <p className="text-gray-600">
              Gerencie suas salas e continue aprendendo!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Join Room Card */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-indigo-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Entrar em uma Sala
                  </CardTitle>
                  <CardDescription>
                    Digite o código de convite para participar de uma nova sala
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinRoom} className="space-y-4">
                    <div>
                      <Label htmlFor="inviteCode">Código de Convite</Label>
                      <Input
                        id="inviteCode"
                        placeholder="Ex: 1234"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        maxLength={8}
                        className="mt-1"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={isJoining}
                    >
                      {isJoining ? 'Entrando...' : 'Entrar na Sala'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Rooms List */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Minhas Salas
                  </CardTitle>
                  <CardDescription>
                    Salas que você já participou ou está participando
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {rooms.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        Você ainda não participou de nenhuma sala. 
                        Use o formulário ao lado para entrar em uma sala com o código de convite!
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {rooms.map((room) => (
                        <Card key={room.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {room.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Código: {room.invite_code}
                                </p>
                              </div>
                              
                              {room.progress && (
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Trophy className="h-4 w-4 text-yellow-500" />
                                      <span>{room.progress.score} pontos</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Clock className="h-4 w-4 text-blue-500" />
                                      <span>{formatTime(room.progress.time_spent)}</span>
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={room.progress.completed ? "default" : "secondary"}
                                    className={room.progress.completed ? "bg-green-500" : "bg-blue-500"}
                                  >
                                    {room.progress.completed ? "Concluído" : "Em Progresso"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              className="mt-3"
                              onClick={() => router.visit(`/student/room/${room.id}`)}
                            >
                              {room.progress?.completed ? "Ver Resultados" : "Continuar"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

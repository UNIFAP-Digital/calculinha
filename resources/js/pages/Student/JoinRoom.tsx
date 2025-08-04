
import StudentLayout from '@/components/layouts/StudentLayout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function JoinRoom() {
  const { room } = usePage().props

  const { data, setData, post, processing, errors } = useForm({
    code: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('student.join-room.store'))
  }

  return (
    <StudentLayout>
      <Head title="Entrar na sala" />

      <main className="grid flex-1 place-content-center bg-muted p-4">
        <div className="grid gap-4">
          {room && (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Você já está em uma sala</CardTitle>
                <CardDescription>
                  Você já está participando da sala{' '}
                  <span className="font-bold">{room.name}</span>. Clique no botão
                  abaixo para entrar no quiz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={route('quiz.index', { room: room.id })}>
                    Entrar no quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Entrar em uma nova sala</CardTitle>
              <CardDescription>
                Digite o código de convite da sala para participar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Código de convite</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    required
                    autoFocus
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code}</p>
                  )}
                </div>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </StudentLayout>
  )
}

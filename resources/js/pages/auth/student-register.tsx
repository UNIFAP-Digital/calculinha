import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { ArrowRight } from 'lucide-react'

export default function StudentRegisterPage() {
  const { data, setData, post, processing, errors } = useForm<{
    name: string
    username: string
    password: string
    password_confirmation: string
    invite_code: string
  }>({
    name: '',
    username: '',
    password: '',
    password_confirmation: '',
    invite_code: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('student.register'))
  }

  return (
    <>
      <Head title="Cadastro de Aluno" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Cadastro de Aluno</CardTitle>
            <CardDescription>
              Use seu código de convite para criar sua conta de aluno.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  onChange={(e) => setData('name', e.target.value)}
                  value={data.name}
                  required
                  autoFocus
                />
                <InputError message={errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  onChange={(e) => setData('username', e.target.value)}
                  value={data.username}
                  required
                />
                <InputError message={errors.username} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="invite_code">Código de Convite</Label>
                <Input
                  id="invite_code"
                  onChange={(e) => setData('invite_code', e.target.value)}
                  value={data.invite_code}
                  required
                  placeholder="Ex: ABC123"
                />
                <InputError message={errors.invite_code} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setData('password', e.target.value)}
                  value={data.password}
                  required
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  value={data.password_confirmation}
                  required
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                Criar Conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-2 text-center text-sm">
          <p>
            Já tem uma conta?{' '}
            <NavLink variant="underline" href={route('student.login')}>
              Entrar
            </NavLink>
            .
          </p>
          <p>
            Você é um professor?{' '}
            <NavLink variant="underline" href={route('teacher.login')}>
              Entrar por aqui
            </NavLink>
            .
          </p>
        </div>
      </div>
    </>
  )
}

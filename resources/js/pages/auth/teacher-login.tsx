import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { ArrowRight } from 'lucide-react'

export default function TeacherLoginPage() {
  const { data, setData, post, processing, errors } = useForm<{
    email: string
    password: string
    remember: boolean
  }>({
    email: '',
    password: '',
    remember: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('teacher.login'))
  }

  return (
    <>
      <Head title="Login do Professor" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login do Professor</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar suas salas e atividades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setData('email', e.target.value)}
                  value={data.email}
                  required
                  autoFocus
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setData('password', e.target.value)}
                  value={data.password}
                  required
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData('remember', !!checked)}
                  />
                  <Label htmlFor="remember" className="cursor-pointer">
                    Lembrar-me
                  </Label>
                </div>
                <NavLink variant="underline" href={route('password.request')}>
                  Esqueceu a senha?
                </NavLink>
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-2 text-center text-sm">
          <p>
            Não tem uma conta?{' '}
            <NavLink variant="underline" href={route('register')}>
              Cadastre-se
            </NavLink>
            .
          </p>
          <p>
            Você é um aluno?{' '}
            <NavLink variant="underline" href={route('login.student')}>
              Entrar por aqui
            </NavLink>
            .
          </p>
        </div>
      </div>
    </>
  )
}

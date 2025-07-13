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

export default function TeacherRegisterPage() {
  const { data, setData, post, processing, errors } = useForm<{
    name: string
    email: string
    username: string
    password: string
    password_confirmation: string
    terms: boolean
  }>({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    terms: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('teacher.register'))
  }

  return (
    <>
      <Head title="Cadastro de Professor" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Cadastro de Professor</CardTitle>
            <CardDescription>
              Crie sua conta para começar a criar salas e atividades.
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setData('email', e.target.value)}
                  value={data.email}
                  required
                />
                <InputError message={errors.email} />
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

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={data.terms}
                  onCheckedChange={(checked) => setData('terms', !!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="cursor-pointer">
                    Aceito os termos e condições
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Você concorda com nossos Termos de Serviço e Política de Privacidade.
                  </p>
                  <InputError message={errors.terms} />
                </div>
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
            <NavLink variant="underline" href={route('login')}>
              Entrar
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

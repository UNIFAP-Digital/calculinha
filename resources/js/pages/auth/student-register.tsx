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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ArrowRight } from 'lucide-react'

export default function StudentRegister() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    username: '',
    enrollment_id: '',
    password: '',
    password_confirmation: '',
    invite_code: '0311',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('student.register.store'))
  }

  return (
    <>
      <Head title="Convite" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem-vindo ao Calculinha</CardTitle>
            <CardDescription>
              Crie sua conta para entrar na sala do seu professor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Seu Nome Completo</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  onChange={(e) => setData('name', e.target.value)}
                  value={data.name}
                  placeholder="Seu nome"
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
                  placeholder="Ex: aluno_123 (sem espaços)"
                  required
                />
                <InputError message={errors.username} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="enrollment_id">Matrícula</Label>
                <Input
                  id="enrollment_id"
                  onChange={(e) => setData('enrollment_id', e.target.value)}
                  value={data.enrollment_id}
                  placeholder="Seu número de matrícula"
                  required
                />
                <InputError message={errors.enrollment_id} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setData('password', e.target.value)}
                  value={data.password}
                  placeholder="Uma senha forte e segura"
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
                  onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                  }
                  value={data.password_confirmation}
                  placeholder="Digite a senha novamente"
                  required
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="invite-code">Código de Convite da Sala</Label>
                <div className="flex items-start justify-between gap-4">
                  <InputOTP
                    id="invite-code"
                    value={data.invite_code}
                    onChange={(value) => setData('invite_code', value)}
                    maxLength={4}
                    required
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={processing}
                  >
                    Entrar na Sala
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <InputError message={errors.invite_code} />
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-2 text-center text-sm">
          <p>
            Já tem uma conta?{' '}
            <NavLink variant="underline" href={route('student.login')}>
              Faça o login
            </NavLink>
            .
          </p>
          <p>
            Você é um professor?{' '}
            <NavLink variant="underline" href={route('login')}>
              Entrar por aqui
            </NavLink>
            .
          </p>
        </div>
      </div>
    </>
  )
}

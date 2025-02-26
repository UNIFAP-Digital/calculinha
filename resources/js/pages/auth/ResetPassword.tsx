import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

export default function ResetPassword({ token, email }: { token: string; email: string }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <>
      <Head title="Redefinir Senha" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Crie uma nova senha</CardTitle>
            <CardDescription>Defina sua nova senha para acessar sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    tabIndex={1}
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    autoComplete="username"
                    readOnly
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    tabIndex={2}
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    autoFocus={true}
                    required
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">Confirme a senha</Label>
                  <Input
                    tabIndex={3}
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <InputError message={errors.password_confirmation} />
                </div>

                <Button tabIndex={4} type="submit" className="w-full" disabled={processing}>
                  Redefinir Senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Lembrou sua senha?{' '}
          <NavLink variant="underline" href={route('login')}>
            Voltar para login
          </NavLink>
          .
        </div>
      </div>
    </>
  )
}

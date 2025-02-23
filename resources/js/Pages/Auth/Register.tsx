import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

export default function RegisterPage() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <>
      <Head title="Cadastrar" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem-vindo ao Calculinha</CardTitle>
            <CardDescription>Crie sua conta preenchendo os dados abaixo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      autoComplete="name"
                      onChange={(e) => setData('name', e.target.value)}
                      autoFocus={true}
                      required
                    />
                    <InputError message={errors.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      value={data.email}
                      autoComplete="username"
                      onChange={(e) => setData('email', e.target.value)}
                      id="email"
                      type="email"
                      placeholder="calculinha@exemplo.com"
                      required
                    />
                    <InputError message={errors.email} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      name="password"
                      value={data.password}
                      autoComplete="new-password"
                      onChange={(e) => setData('password', e.target.value)}
                      required
                      id="password"
                      type="password"
                    />
                    <InputError message={errors.password} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirme a senha</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      name="password_confirmation"
                      value={data.password_confirmation}
                      autoComplete="new-password"
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={processing}>
                    Cadastrar
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Já tem uma conta?{' '}
          <NavLink href={route('login')} variant="underline">
            Entrar
          </NavLink>
          .
        </div>
      </div>
    </>
  )
}

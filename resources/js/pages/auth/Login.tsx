import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { MailQuestion } from 'lucide-react'
import { FormEventHandler } from 'react'

export default function LoginPage() {
  /** TODO: Remove default values of debug */
  const { data, setData, post, processing, errors, reset } = useForm({
    email: 'calculinha@gmail.com',
    password: 'asd',
    remember: false as boolean,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('login'), {
      onFinish: () => reset('password'),
    })
  }

  return (
    <>
      <Head title="Entrar" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem-vindo ao Calculinha</CardTitle>
            <CardDescription>Entre na sua conta preenchendo os dados abaixo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-6">
                <Alert>
                  <MailQuestion className="size-4" />
                  <AlertTitle>Tem um convite?</AlertTitle>
                  <AlertDescription>
                    Então clique{' '}
                    <NavLink href={route('invite')} variant="underline">
                      aqui
                    </NavLink>{' '}
                    para acessar por ele.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      tabIndex={1}
                      id="email"
                      autoComplete="email"
                      onChange={(e) => setData('email', e.target.value)}
                      autoFocus={true}
                      type="email"
                      value={data.email}
                      placeholder="calculinha@exemplo.com"
                      required
                    />
                    <InputError message={errors.email} />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                      <NavLink href={route('password.request')} color="muted" className="ml-auto">
                        Esqueceu a senha?
                      </NavLink>
                    </div>
                    <Input
                      tabIndex={2}
                      id="password"
                      type="password"
                      value={data.password}
                      required
                      autoComplete="current-password"
                      onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      tabIndex={3}
                      id="remember"
                      name="remember"
                      checked={data.remember}
                      onCheckedChange={(value) => setData('remember', value as false)}
                    />
                    <Label htmlFor="remember">Continuar conectado</Label>
                  </div>
                  <Button tabIndex={4} type="submit" className="w-full" disabled={processing}>
                    Entrar
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Não tem uma conta?{' '}
          <NavLink variant="underline" href={route('register')}>
            Cadastrar
          </NavLink>
          .
        </div>
      </div>
    </>
  )
}

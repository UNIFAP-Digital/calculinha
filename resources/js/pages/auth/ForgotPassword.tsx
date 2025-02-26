import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { MailOpenIcon } from 'lucide-react'
import { FormEventHandler } from 'react'

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('password.email'))
  }

  return (
    <>
      <Head title="Recuperar Senha" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recuperação de Senha</CardTitle>
            <CardDescription>Informe seu email e enviaremos um link para redefinir sua senha.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-6">
                {status && (
                  <Alert className="border-green-200 bg-green-50 text-green-700">
                    <MailOpenIcon className="size-4" />
                    <AlertTitle>Email enviado</AlertTitle>
                    <AlertDescription>{status}</AlertDescription>
                  </Alert>
                )}

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

                  <Button tabIndex={2} type="submit" className="w-full" disabled={processing}>
                    Enviar Link de Recuperação
                  </Button>
                </div>
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

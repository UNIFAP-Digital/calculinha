import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InputError from '@/components/ui/input-error'
import { Label } from '@/components/ui/label'
import { NavLink } from '@/components/ui/nav-link'
import { Head, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ArrowRight } from 'lucide-react'

export default function InvitePage() {
  const { data, setData, post, processing, errors } = useForm({
    name: 'Calculinha',
    enrollment_id: '11111111',
    invite_code: '0311',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('invite'))
  }

  return (
    <>
      <Head title="Convite" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem-vindo ao Calculinha</CardTitle>
            <CardDescription>Insira seu nome e código de convite do seu professor.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      onChange={(e) => setData('name', e.target.value)}
                      autoFocus={true}
                      value={data.name}
                      placeholder="Um nome muito legal XD"
                      required
                    />
                    <InputError message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="enrollment_id">Núm. Matrícula</Label>
                    <Input
                      id="enrollment_id"
                      onChange={(e) => setData('enrollment_id', e.target.value)}
                      value={data.enrollment_id}
                      placeholder="Você pode encontrar no seu boletim"
                      required
                    />
                    <InputError message={errors.enrollment_id} />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-end gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="invite-code">Código de convite</Label>
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
                      </div>
                      <Button tabIndex={4} type="submit" className="w-full" disabled={processing}>
                        Continuar
                        <ArrowRight />
                      </Button>
                    </div>
                    <InputError message={errors.invite_code} />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Você é um professor e quer criar uma atividade?{' '}
          <NavLink variant="underline" href={route('login')}>
            Entrar
          </NavLink>
          .
        </div>
      </div>
    </>
  )
}

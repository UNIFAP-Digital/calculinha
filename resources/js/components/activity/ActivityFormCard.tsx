import TextAreaWithEmojiPicker from '@/components/TextAreaWithEmojiPicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import InputError from '@/components/ui/input-error'
import { Activity } from '@/models/activity'
import { useForm } from '@inertiajs/react'
import { Check, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ActivityFormCardProps {
  activity?: Activity
  onSaved: () => void
  onCancel: () => void
}

export default function ActivityFormCard({ activity, onCancel, onSaved }: ActivityFormCardProps) {
  const isEditing = !!activity

  const { data, setData, post, put, processing, reset, errors } = useForm({
    question: activity?.question ?? '',
    correct_answer: activity?.correct_answer ?? '',
    wrong_answers: activity?.wrong_answers ?? ['', '', ''],
    operation: activity?.operation ?? ''
  })

  const handleSave = () => {
    if (isEditing) {
      put(route('activities.update', activity.id), {
        onSuccess: () => {
          reset()
          onSaved()
        }
      })
    } else {
      post(route('activities.store'), {
        onSuccess: () => {
          reset()
          onSaved()
        }
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">{isEditing ? 'Editar Atividade' : 'Adicionar Atividade'}</span>
          <Badge variant="secondary">Múltipla escolha</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid space-y-2">
          <Label htmlFor="operation">Operação</Label>
          <Select value={data.operation} disabled={isEditing} onValueChange={(value) => setData('operation', value)}>
            <SelectTrigger id="operation" className="w-full">
              <SelectValue placeholder="Selecione uma operação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="addition">Adição</SelectItem>
              <SelectItem value="subtraction">Subtração</SelectItem>
              <SelectItem value="multiplication">Multiplicação</SelectItem>
              <SelectItem value="division">Divisão</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.operation} />
        </div>

        <div className="grid space-y-2">
          <TextAreaWithEmojiPicker
            id="question"
            label="Pergunta"
            value={data.question}
            onChange={(v) => setData('question', v)}
            placeholder="Digite a questão aqui..."
          />
          <InputError message={errors.question} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="border-primary text-primary flex items-center justify-center rounded-md border-2">
              <Check className="h-4 w-4" />
            </div>
            <div className="w-full space-y-2">
              <TextAreaWithEmojiPicker
                value={data.correct_answer}
                placeholder="Digite a resposta aqui..."
                onChange={(value) => setData('correct_answer', value)}
              />
              <InputError message={errors.correct_answer} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border-destructive text-destructive flex items-center justify-center rounded-md border-2">
              <X className="h-4 w-4" />
            </div>
            <div className="w-full space-y-2">
              <TextAreaWithEmojiPicker
                value={data.wrong_answers[0]}
                placeholder="Digite a resposta aqui..."
                onChange={(value) => {
                  setData((previousData) => ({
                    ...previousData,
                    wrong_answers: [value, previousData.wrong_answers[1], previousData.wrong_answers[2]]
                  }))
                }}
              />
              <InputError message={errors['wrong_answers.0' as keyof typeof errors]} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border-destructive text-destructive flex items-center justify-center rounded-md border-2">
              <X className="h-4 w-4" />
            </div>
            <div className="w-full space-y-2">
              <TextAreaWithEmojiPicker
                value={data.wrong_answers[1]}
                placeholder="Digite a resposta aqui..."
                onChange={(value) => {
                  setData((previousData) => ({
                    ...previousData,
                    wrong_answers: [previousData.wrong_answers[0], value, previousData.wrong_answers[2]]
                  }))
                }}
              />
              <InputError message={errors['wrong_answers.1' as keyof typeof errors]} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border-destructive text-destructive flex items-center justify-center rounded-md border-2">
              <X className="h-4 w-4" />
            </div>
            <div className="w-full space-y-2">
              <TextAreaWithEmojiPicker
                value={data.wrong_answers[2]}
                placeholder="Digite a resposta aqui..."
                onChange={(value) => {
                  setData((previousData) => ({
                    ...previousData,
                    wrong_answers: [previousData.wrong_answers[0], previousData.wrong_answers[1], value]
                  }))
                }}
              />
              <InputError message={errors['wrong_answers.2' as keyof typeof errors]} />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={processing}>
          Salvar
        </Button>
      </CardFooter>
    </Card>
  )
}

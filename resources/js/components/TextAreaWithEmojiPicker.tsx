import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import EmojiPicker from 'emoji-picker-react'
import { EmojiClickData } from 'emoji-picker-react/src/types/exposedTypes'
import { Smile } from 'lucide-react'
import { useState } from 'react'

interface TextAreaWithEmojiPickerProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export default function TextAreaWithEmojiPicker({ id, label, value, onChange, placeholder }: TextAreaWithEmojiPickerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    onChange(value + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="w-full grid space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pr-10" />

        <div className="absolute top-2 right-2">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" type="button" className="h-6 w-6 rounded-full bg-transparent p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Smile className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" side="right" align="start">
              <EmojiPicker onEmojiClick={onEmojiClick} lazyLoadEmojis skinTonesDisabled previewConfig={{ showPreview: false }} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

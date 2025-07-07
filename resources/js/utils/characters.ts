export type DialogueLine = {
  id: number
  text: string
  emotion: string
}

// Define a type for characters
export type Character = {
  name: string
  avatarSrc: string
  dialogues: DialogueLine[]
}

export const characters: { [key: string]: Character } = {
  addition: {
    name: 'Adição',
    avatarSrc: '/unicorn-avatar.png',
    dialogues: [
      {
        id: 1,
        text: 'Olá, meus amores! Eu sou a Adição! Meu poder é juntar com carinho.',
        emotion: 'happy',
      },
      {
        id: 2,
        text: 'Quando você tem duas maçãs e ganha mais uma, sou eu quem faz tudo se unir e virar três!',
        emotion: 'excited',
      },
      {
        id: 3,
        text: 'Amo somar abraços, brinquedos e alegrias! Prontos para somar?',
        emotion: 'joyful',
      },
    ],
  },
  subtraction: {
    name: 'Subtração',
    avatarSrc: '/robot-avatar.png',
    dialogues: [
      {
        id: 1,
        text: 'Prazer! Eu sou a Subtração! Eu tenho um poder especial: sei tirar só o que é preciso para tudo ficar justo.',
        emotion: 'enthusiastic',
      },
      {
        id: 2,
        text: 'Se você tem cinco balas e dá duas para um amigo, fui eu quem ajudou a fazer a conta! Nada de bagunça, só equilíbrio!',
        emotion: 'balanced',
      },
    ],
  },
  multiplication: {
    name: 'Multiplicação',
    avatarSrc: '/dragon-avatar.png',
    dialogues: [
      {
        id: 1,
        text: 'Ei, pessoal! Sou a Multiplicação! Meu poder é fazer tudo crescer com alegria!',
        emotion: 'laughing',
      },
      {
        id: 2,
        text: 'Se você tem três pacotes com quatro figurinhas em cada, eu ajudo você a descobrir quantas tem no total. Crescer é comigo mesmo!',
        emotion: 'energetic',
      },
    ],
  },
  division: {
    name: 'Divisão',
    avatarSrc: '/cat-avatar.png',
    dialogues: [
      {
        id: 1,
        text: 'Olá, queridos. Eu sou a Divisão. Gosto de repartir com igualdade.',
        emotion: 'calm',
      },
      {
        id: 2,
        text: 'Se você tem 12 biscoitos e quer dividir com 3 amigos, eu ajudo a distribuir para que todos fiquem felizes. Comigo, ninguém fica de fora!',
        emotion: 'serene',
      },
    ],
  },
  all: {
    name: 'Professor Coruja',
    avatarSrc: '/owl-avatar.png',
    dialogues: [
      {
        id: 1,
        text: 'Hoo-hoo! É hora de testar suas habilidades! Vamos ver o quanto você já aprendeu.',
        emotion: 'wise',
      },
      {
        id: 2,
        text: 'Lembre-se, cada desafio é uma chance de brilhar. Concentre-se e dê o seu melhor!',
        emotion: 'encouraging',
      },
    ],
  },
}


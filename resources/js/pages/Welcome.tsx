import ProfileCard from '@/components/ui/ProfileCard'
import { Head } from '@inertiajs/react'
import { AppLogo } from '@/components/ui/AppLogo'

export default function Welcome() {
  console.log('versão 4.0');
  return (
    <>
      <Head title="Bem-vindo à Calculinha">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=fredoka:400,500,600|nunito:400,500,600,700" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 text-gray-800 sm:p-5 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <header className="animate-fade-in w-full max-w-3xl text-center pt-3 sm:pt-4">
          <div className="mb-2 flex justify-center sm:mb-3">
            <AppLogo iconSize="md" textSize="lg" />
          </div>
          <p className="font-nunito text-sm text-gray-600 sm:text-base dark:text-gray-300">
            Escolha seu perfil para continuar
          </p>
        </header>

        <div className="flex w-full max-w-3xl flex-col justify-center gap-5 py-3 sm:gap-6 md:flex-row md:items-start">
          <ProfileCard
            title="Sou Aluno"
            description="Vamos jogar e aprender matemática juntos! Embarque nessa aventura divertida com a Calculinha."
            buttonText="Começar a Jogar!"
            buttonHref={route('student.login')}
            buttonVariant="primary"
            containerClassName="animate-fade-in"
          >
            <div className="aspect-square w-full overflow-hidden rounded-t-md">
              <img 
                className="h-full w-full object-cover" 
                src="/welcomeStudent.png" 
                alt="Estudante interagindo com elementos matemáticos" 
              />
            </div>
          </ProfileCard>

          <ProfileCard
            title="Sou Professor"
            description="Acesse o painel de controle para gerenciar turmas, criar quizzes e acompanhar o progresso dos seus alunos."
            buttonText="Acessar Painel"
            buttonHref={route('login')}
            buttonVariant="secondary"
            containerClassName="animate-fade-in-delay"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-t-md bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="animate-wiggle absolute top-3 left-3 text-lg font-bold text-white/30">+</span>
                <span className="animate-float absolute top-4 right-4 text-xl font-bold text-white/30">÷</span>
                <span className="animate-bounce-slow absolute bottom-3 left-6 text-xl font-bold text-white/30">×</span>
                <span className="absolute right-3 bottom-3 animate-pulse text-lg font-bold text-white/30">−</span>
                <span className="animate-ping-slow absolute top-6 left-8 text-lg font-bold text-white/30">=</span>
              </div>
              <div className="relative flex h-full w-full items-center justify-center">
                <img 
                  src="/welcomeTeacher.png" 
                  alt="Elementos matemáticos" 
                  className="h-full w-full object-contain opacity-50" 
                />
              </div>
            </div>
          </ProfileCard>
        </div>

        <footer className="font-nunito animate-fade-in-delay-long text-center text-[10px] text-gray-500 py-2 dark:text-gray-400 sm:text-xs">
          <p>© {new Date().getFullYear()} Calculinha - Transformando o aprendizado de matemática em diversão</p>
          <a href="https://www.flaticon.com/free-stickers/homework" title="homework stickers" className="text-[9px] sm:text-[10px]">
            Imagem do site Stickers - Flaticon
          </a>
        </footer>
      </div>
    </>
  )
}

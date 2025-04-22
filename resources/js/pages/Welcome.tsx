import { Head, Link } from '@inertiajs/react'
import '../../css/welcome.css'
import VLibras from '@/components/vlibras/vlibras'
import ProfileCard from '@/components/ui/ProfileCard'

export default function Welcome() {
  return (
    <>
      <Head title="Bem-vindo à Calculinha">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=fredoka:400,500,600|nunito:400,500,600,700" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 text-gray-800 lg:p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <header className="animate-fade-in w-full max-w-6xl text-center pt-2 sm:pt-4 lg:pt-6">
          <div className="mb-1 flex justify-center sm:mb-2 lg:mb-3">
            <img 
              src="/favicon.ico" 
              alt="Logo Calculinha" 
              className="h-10 w-10 transition-transform duration-700 hover:rotate-6 sm:h-14 sm:w-14 lg:h-16 lg:w-16" 
            />
          </div>
          <h1 className="font-fredoka mb-0.5 text-2xl font-bold text-blue-600 sm:mb-1 sm:text-3xl lg:mb-2 lg:text-4xl dark:text-blue-400">
            Calculinha
          </h1>
          <p className="font-nunito text-base text-gray-600 sm:text-lg lg:text-xl dark:text-gray-300">
            Escolha seu perfil para continuar
          </p>
        </header>

        {/* Container principal dos cards */}
        <div className="flex w-full max-w-5xl flex-col justify-center gap-4 py-2 sm:gap-6 md:flex-row md:gap-4 lg:gap-8 xl:gap-10">
          {/* Card "Sou Aluno" */}
          <ProfileCard
            title="Sou Aluno"
            description="Vamos jogar e aprender matemática juntos! Embarque nessa aventura divertida com a Calcuinha."
            buttonText="Começar a Jogar!"
            buttonHref={route('invite')}
            buttonVariant="primary"
            containerClassName="animate-fade-in"
          >
            {/* Image/Icon area for Aluno */}
            <div className="overmodule-hidden h-32 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 sm:h-36 lg:h-40">
              {/* Elementos matemáticos decorativos */}
              <div className="absolute h-full w-full">
                <span className="animate-wiggle absolute top-3 left-3 text-xl font-bold text-white/30 sm:top-4 sm:left-4 sm:text-2xl lg:top-6 lg:left-6 lg:text-3xl">+</span>
                <span className="animate-float absolute top-6 right-6 text-2xl font-bold text-white/30 sm:top-8 sm:right-8 sm:text-3xl lg:top-10 lg:right-10 lg:text-4xl">÷</span>
                <span className="animate-bounce-slow absolute bottom-2 left-10 text-2xl font-bold text-white/30 sm:bottom-3 sm:left-12 sm:text-3xl lg:bottom-4 lg:left-16 lg:text-4xl">×</span>
                <span className="absolute right-4 bottom-4 animate-pulse text-xl font-bold text-white/30 sm:right-6 sm:bottom-6 sm:text-2xl lg:right-8 lg:bottom-8 lg:text-3xl">−</span>
                <span className="animate-ping-slow absolute top-10 left-16 text-xl font-bold text-white/30 sm:top-12 sm:left-20 sm:text-2xl lg:top-14 lg:left-24 lg:text-3xl">=</span>
              </div>
              <div className="relative flex h-full w-full items-center justify-center mix-blend-luminosity">
                <div className="relative h-full w-full items-center justify-center  bg-white">
                  <img src="/material/math_elements.png" alt="Elementos matemáticos" className="object-cover h-full w-full object-center" />
                </div>
              </div>
            </div>
          </ProfileCard>

          {/* Card "Sou Professor" */}
          <ProfileCard
            title="Sou Professor"
            description="Acesse o painel de controle para gerenciar turmas, criar quizzes e acompanhar o progresso dos seus alunos."
            buttonText="Acessar Painel"
            buttonHref={route('login')}
            buttonVariant="secondary"
            containerClassName="animate-fade-in-delay"
          >
            {/* Image/Icon area for Professor */}
            <div className="overmodule-hidden h-32 bg-gradient-to-r from-blue-700 to-indigo-800 sm:h-36 lg:h-40">
              <div className="absolute h-full w-full">
                {/* Grade sutil de fundo */}
                <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
              </div>
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Ícone de professor - chapéu de formatura */}
                <div className="relative h-16 w-16 rounded-lg transition-transform duration-300 hover:-translate-y-1 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                  <img src="material/toga.png" className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-16 lg:w-16" alt="Chapéu de formatura (toga)" />
                </div>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Rodapé da página */}
        <footer className="font-nunito animate-fade-in-delay-long text-center text-xs text-gray-500 py-2 sm:py-3 lg:py-4 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Calcuinha - Transformando o aprendizado de matemática em diversão</p>
          <a href="https://www.flaticon.com/free-stickers/homework" title="homework stickers" className="text-[10px] sm:text-xs">
            Imagem do site Stickers - Flaticon
          </a>
        </footer>
      </div>
    </>
  )
}
